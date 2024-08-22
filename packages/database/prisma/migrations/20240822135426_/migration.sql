-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "luciaoauth";

-- CreateEnum
CREATE TYPE "luciaoauth"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "luciaoauth"."UserOneTimePasswordType" AS ENUM ('SIGNUP', 'LOGIN', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "luciaoauth"."SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAUSED', 'CANCELED', 'PAST_DUE', 'UNPAID', 'INCOMPLETE', 'EXPIRED');

-- CreateTable
CREATE TABLE "luciaoauth"."User" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "luciaoauth"."UserRole" NOT NULL DEFAULT 'USER',
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hashedPassword" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luciaoauth"."UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "impersonatorId" TEXT,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luciaoauth"."UserOauthAccount" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserOauthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luciaoauth"."UserVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luciaoauth"."UserOneTimePassword" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "luciaoauth"."UserOneTimePasswordType" NOT NULL,
    "identifier" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOneTimePassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luciaoauth"."CTA" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CTA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luciaoauth"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "luciaoauth"."SubscriptionStatus" NOT NULL,
    "planId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "nextPaymentDate" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "luciaoauth"."User"("phone");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "luciaoauth"."UserSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOauthAccount_providerId_providerUserId_key" ON "luciaoauth"."UserOauthAccount"("providerId", "providerUserId");

-- CreateIndex
CREATE INDEX "UserVerificationToken_userId_idx" ON "luciaoauth"."UserVerificationToken"("userId");

-- CreateIndex
CREATE INDEX "UserOneTimePassword_userId_idx" ON "luciaoauth"."UserOneTimePassword"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "luciaoauth"."Subscription"("userId");

-- AddForeignKey
ALTER TABLE "luciaoauth"."UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "luciaoauth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luciaoauth"."UserOauthAccount" ADD CONSTRAINT "UserOauthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "luciaoauth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luciaoauth"."UserVerificationToken" ADD CONSTRAINT "UserVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "luciaoauth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luciaoauth"."UserOneTimePassword" ADD CONSTRAINT "UserOneTimePassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "luciaoauth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luciaoauth"."CTA" ADD CONSTRAINT "CTA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "luciaoauth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luciaoauth"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "luciaoauth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
