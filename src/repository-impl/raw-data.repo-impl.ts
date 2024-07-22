import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { from, map } from 'rxjs';
import { RawDataRepo } from 'src/repository/raw-data.repo';

@Injectable()
export class RawDataRepoImpl extends RawDataRepo {
  async fetch() {
    const stream = createReadStream('data/open_data.csv').pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
      }),
    );
    return from(stream).pipe(
      map((data) => {
        return {
          in: {
            ...data,
            crawled_at: new Date(data.crawled_at),
          },
          out: [],
        };
      }),
    );
  }
}
