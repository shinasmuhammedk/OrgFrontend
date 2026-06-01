import HttpRequestNode from "./HttpRequestNode";
import WebhookTriggerNode from "./WebHookTriggerNode";
import ConditionNode from "./ConditionNode";
import DelayNode from "./DelayNode";
import EmailNode from "./EmailNode";
import AINode from "./AINode";

export const nodeTypes = {
    httpRequest: HttpRequestNode,
    webhookTrigger: WebhookTriggerNode,
    conditionNode: ConditionNode,
    delayNode: DelayNode,
    emailNode: EmailNode,
    aiNode : AINode
};