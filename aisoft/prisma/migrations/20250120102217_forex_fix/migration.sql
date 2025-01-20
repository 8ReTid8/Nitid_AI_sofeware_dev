-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(100) NOT NULL,
    "user_role" VARCHAR(50) NOT NULL,
    "user_password" VARCHAR(100) NOT NULL,
    "user_email" VARCHAR(100) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "OHLC_data" (
    "OHLC_id" SERIAL NOT NULL,
    "OHLC_date" DATE NOT NULL,
    "open" DECIMAL NOT NULL,
    "high" DECIMAL NOT NULL,
    "low" DECIMAL NOT NULL,
    "close" DECIMAL NOT NULL,

    CONSTRAINT "OHLC_data_pkey" PRIMARY KEY ("OHLC_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_name_key" ON "user"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_password_key" ON "user"("user_password");
