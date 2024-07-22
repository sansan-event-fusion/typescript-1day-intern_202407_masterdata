-- CreateTable
CREATE TABLE "BaseAttribute" (
    "id" SERIAL NOT NULL,
    "sansan_organization_code" TEXT NOT NULL,
    "sansan_location_code" TEXT NOT NULL,
    "data_source" TEXT NOT NULL,
    "crawled_at" TIMESTAMP(3) NOT NULL,
    "attribute" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "BaseAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessLocation" (
    "id" SERIAL NOT NULL,
    "sansan_organization_code" TEXT NOT NULL,
    "sansan_location_code" TEXT NOT NULL,
    "base_name" TEXT NOT NULL,
    "zip_code" TEXT,
    "address" TEXT NOT NULL,
    "phone_number" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessLocation_pkey" PRIMARY KEY ("id")
);
