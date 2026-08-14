import { Prisma } from "@prisma/client";

export type TopicWithOptions = Prisma.TopicGetPayload<{ include: { options: true } }>;
