import { Subscription } from "@/domain/entities/subscription";
import { subscriptionResponse } from "../interfaces/subscription.response";

export class SubscriptionMapper {
  static SubcriptionToEntity(
    VashSubcription: subscriptionResponse
  ): Subscription {
    return {
      id: VashSubcription.id,
      account_email: VashSubcription.accounts.account_email,
      account_id: VashSubcription.account_id,
      name_service: VashSubcription.services.name,
      services_id: VashSubcription.services_id,
      status: VashSubcription.status,
      user_name_subscription: VashSubcription.user_name_subscription,
    };
  }
}
