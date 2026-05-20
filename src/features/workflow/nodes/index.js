import HttpRequestNode from "./HttpRequestNode";
import WebHookTriggerNode from "./WebHookTriggerNode";
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