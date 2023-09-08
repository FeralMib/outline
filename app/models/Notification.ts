import { TFunction } from "i18next";
import { action, observable } from "mobx";
import { NotificationEventType } from "@shared/types";
import {
  collectionPath,
  commentPath,
  documentPath,
  settingsPath,
} from "~/utils/routeHelpers";
import BaseModel from "./BaseModel";
import Comment from "./Comment";
import Document from "./Document";
import User from "./User";
import Field from "./decorators/Field";

class Notification extends BaseModel {
  @Field
  @observable
  id: string;

  /**
   * The date the notification was marked as read.
   */
  @Field
  @observable
  viewedAt: Date | null;

  /**
   * The date the notification was archived.
   */
  @Field
  @observable
  archivedAt: Date | null;

  /**
   * The user that triggered the notification.
   */
  actor?: User;

  /**
   * The document ID that the notification is associated with.
   */
  documentId?: string;

  /**
   * The document that the notification is associated with.
   */
  document?: Document;

  /**
   * The collection ID that the notification is associated with.
   */
  collectionId?: string;

  /**
   * The comment that the notification is associated with.
   */
  comment?: Comment;

  /**
   * The type of notification.
   */
  event: NotificationEventType;

  /**
   * Mark the notification as read or unread
   *
   * @returns A promise that resolves when the notification has been saved.
   */
  @action
  toggleRead() {
    this.viewedAt = this.viewedAt ? null : new Date();
    return this.save();
  }

  /**
   * Mark the notification as read
   *
   * @returns A promise that resolves when the notification has been saved.
   */
  @action
  markAsRead() {
    if (this.viewedAt) {
      return;
    }

    this.viewedAt = new Date();
    return this.save();
  }

  /**
   * Returns translated text that describes the notification
   *
   * @param t - The translation function
   * @returns The event text
   */
  eventText(t: TFunction): string {
    switch (this.event) {
      case NotificationEventType.PublishDocument:
        return t("published");
      case NotificationEventType.UpdateDocument:
      case NotificationEventType.CreateRevision:
        return t("edited");
      case NotificationEventType.CreateCollection:
        return t("created the collection");
      case NotificationEventType.MentionedInDocument:
      case NotificationEventType.MentionedInComment:
        return t("mentioned you in");
      case NotificationEventType.CreateComment:
        return t("left a comment on");
      default:
        return this.event;
    }
  }

  /**
   * Returns the subject of the notification. This is the title of the associated
   * document.
   *
   * @returns The subject
   */
  get subject() {
    return this.document?.title;
  }

  /**
   * Returns the path to the model associated with the notification that can be
   * used with the router.
   *
   * @returns The router path.
   */
  get path() {
    switch (this.event) {
      case NotificationEventType.PublishDocument:
      case NotificationEventType.UpdateDocument:
      case NotificationEventType.CreateRevision: {
        return this.document ? documentPath(this.document) : "";
      }
      case NotificationEventType.CreateCollection: {
        const collection = this.store.rootStore.documents.get(
          this.collectionId
        );
        return collection ? collectionPath(collection.url) : "";
      }
      case NotificationEventType.MentionedInDocument: {
        return this.document?.url;
      }
      case NotificationEventType.MentionedInComment:
      case NotificationEventType.CreateComment: {
        return this.document && this.comment
          ? commentPath(this.document, this.comment)
          : this.document?.url;
      }
      case NotificationEventType.InviteAccepted: {
        return settingsPath("members");
      }
      case NotificationEventType.Onboarding:
      case NotificationEventType.Features: {
        return "";
      }
      case NotificationEventType.ExportCompleted: {
        return settingsPath("export");
      }
      default:
        this.event satisfies never;
        return;
    }
  }
}

export default Notification;
