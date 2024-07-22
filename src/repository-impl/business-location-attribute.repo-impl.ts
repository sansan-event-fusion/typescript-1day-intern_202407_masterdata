import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma/prisma.service';
import { Observable, of } from 'rxjs';
import { BusinessLocationAttributeRepo } from 'src/repository/business-location-attribute.repo';
import { MergeWorkFlowData } from 'src/types/merge-workflow-step';
import { BusinessLocationAttribute } from 'src/value/business-location-attribute';
import { BusinessLocationAttributesGroupBySOC } from 'src/value/business-location-attribute-group';

@Injectable()
export class BusinessLocationAttributeRepoImpl extends BusinessLocationAttributeRepo {
  constructor(private prisma: PrismaService) {
    super();
  }
  async fetch() {
    const res = await this.prisma.$queryRaw<
      BusinessLocationAttributesGroupBySOC[]
    >`
select sansan_organization_code, json_agg(json_build_object(
'sansan_organization_code', sansan_organization_code,
'sansan_location_code', sansan_location_code,
'data_source', data_source,
'attribute', attribute,
'value', value,
'crawled_at', crawled_at
)) as attributes
from "BaseAttribute"
where sansan_organization_code <> ''
group by sansan_organization_code
`;
    const inputs = res.map((r: BusinessLocationAttributesGroupBySOC) => {
      const attributes = r.attributes.map((a: BusinessLocationAttribute) => {
        return {
          ...a,
          crawled_at: new Date(a.crawled_at),
        };
      });
      return {
        ...r,
        attributes,
      };
    });

    const observable: Observable<MergeWorkFlowData> = of(
      ...inputs.map((inData) => {
        return {
          in: inData,
          out: [],
        };
      }),
    );
    return observable;
  }
}
