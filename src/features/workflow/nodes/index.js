import HttpRequestNode from "./HttpRequestNode";
import WebhookTriggerNode from "./WebHookTriggerNode";
import ConditionNode from "./ConditionNode";
import DelayNode from "./DelayNode";
import EmailNode from "./EmailNode";

export const nodeTypes = {
    httpRequest: HttpRequestNode,
    webhookTrigger: WebhookTriggerNode,
    conditionNode: ConditionNode,
    delayNode: DelayNode,
    emailNode: EmailNode,
};