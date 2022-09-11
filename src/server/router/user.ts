import { requestOtpSchema } from "./../../schema/user.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  createUserOutputSchema,
  createUserSchema,
} from "../../schema/user.schema";
import { createRouter } from "./context";
import * as trpc from "@trpc/server";
import { sendLoginEmail } from "../../utils/mailer";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    output: createUserOutputSchema,
    async resolve({ ctx, input }) {
      const { email, name } = input;

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });

        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("request-otp", {
    input: requestOtpSchema,
    async resolve({ ctx, input }) {
      const { email, redirect } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const token = await ctx.prisma.loginToken.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // send email to user
      await sendLoginEmail({
        token: "",
        url: "",
      });

      return true;
    },
  });
