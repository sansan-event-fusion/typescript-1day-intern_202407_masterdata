-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "country_code" DROP NOT NULL,
ALTER COLUMN "corporate_number" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name_furigana" DROP NOT NULL,
ALTER COLUMN "address_inside" DROP NOT NULL,
ALTER COLUMN "prefecture_name" DROP NOT NULL,
ALTER COLUMN "prefecture_code" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;
