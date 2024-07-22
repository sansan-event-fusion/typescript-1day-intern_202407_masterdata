-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "sansan_organization_code" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "corporate_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_furigana" TEXT NOT NULL,
    "address_inside" TEXT NOT NULL,
    "prefecture_name" TEXT NOT NULL,
    "prefecture_code" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
