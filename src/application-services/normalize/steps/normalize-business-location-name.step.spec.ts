import { NormalizeBusinessLocationNameStep } from 'src/application-services/normalize/steps/normalize-business-location-name.step';
import { Attributes } from 'src/value/attribute';
import { dummyRawData } from 'src/application-services/normalize/steps/fixtures';
import { NormalizeWorkFlowData } from 'src/types/normalize-workflow-step';

const inputToOutput = (input: NormalizeWorkFlowData) => {
  return {
    sansan_organization_code: input.in.sansan_organization_code,
    sansan_location_code: input.in.sansan_location_code,
    data_source: input.in.data_source,
    crawled_at: input.in.crawled_at,
    attribute: Attributes.BASE_NAME,
  };
};

describe('NormalizeBusinessLocationNameStep', () => {
  describe('1. 入力値がfalsyな値の場合、データにEAVを追加しない', () => {
    it.each([[null], [undefined], ['']])('%s', async (base_name) => {
      const inputData = {
        in: {
          ...dummyRawData,
          base_name: base_name,
        },
        out: [],
      };

      const result = await NormalizeBusinessLocationNameStep(inputData);
      expect(result.out.length).toEqual(0);
    });
  });

  it('2. 置換対象文字が置換される', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        base_name:
          '⺃⺅⺇⺉⺋⺍⺎⺏⺐⼪⺒⺓⼳⺔⺖⺗⺘⺙⺛⺞⺟⺠⺡⺣⺤⺦⺨⺪⺫⺲⺭⺮⺱⺳⺹⺽⺾⺿⻀⻁⻂⻃⻄⻊⻌⻍⻏⻖⻑⾧⻒⻘⻞⻟⻤⿁⻨⻩⻫⻭⻯⻲⼀⼁⼂⼃⼄⼅⼆⼇⼈⼉⼊⼋⼌⼍⼎⼏⼐⼑⼒⼓⼔⼕⼖⼗⼘⼙⼚⼛⼜⼝⼞⼟⼠⼡⼢⼣⼤⼥⼦⼧⼨⼩⼫⼬⼭⼮⼯⼰⼱⼲⼴⼵⼶⼷⼸⼹⼺⼻⼼⼽⼾⼿⽀⽁⽂⽃⽄⽅⽆⽇⽈⽉⽊⽋⽌⽍⽎⽏⽐⽑⽒⽓⽔⽕⽖⽗⽘⽙⽚⽛⽜⽝⽞⽟⽠⽡⽢⽣⽤⽥⽦⽧⽨⽩⽪⽫⽬⽭⽮⽯⽰⽱⽲⽳⽴⽵⽶⽷⽸⽹⽺⽻⽼⽽⽾⽿⾀⾁⾂⾃⾄⾅⾆⾇⾈⾉⾊⾋⾌⾍⾎⾏⾐⾑⾒⾓⾔⾕⾖⾗⾘⾙⾚⾛⾜⾝⾞⾟⾠⾡⾢⾣⾤⾥⾦⾨⾩⾪⾫⾬⾭⾮⾯⾰⾱⾲⾳⾴⾵⾶⾷⾸⾹⾺⾻⾼⾽⾾⾿⿀⿂⿃⿄⿅⿆⿇⿈⿉⿊⿋⿌⿍⿎⿏⿐⿑⿒⿓⿔⿕',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value:
        '乚亻𠘨刂㔾𭕄兀尣尢尢巳幺幺彑忄㣺扌攵旡歺母民氵灬爫丬犭𤴔罒罒礻𥫗罓𦉪耂𦥑艹艹艹虎衤覀西𧾷辶辶阝阝長長镸青𩙿飠鬼鬼麦黄斉歯竜亀一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尸屮山巛工己巾干广廴廾弋弓彐彡彳心戈戸手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲魚鳥鹵鹿麥麻黃黍黒黹黽鼎鼓鼠鼻齊齒龍龜龠',
    };

    const result = await NormalizeBusinessLocationNameStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  it('3. 置換対象文字が複数含まれていても全て置換される', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        base_name: '⽝かわいいよ⽝',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '犬かわいいよ犬',
    };

    const result = await NormalizeBusinessLocationNameStep(inputData);

    expect(result.out[0]).toEqual(expectedOutput);
  });

  describe.skip('4. 拠点名に法人名が含まれている場合、法人名を除去する', () => {
    it.each(['株式会社Sansan', 'Sansan株式会社'])(
      '%s',
      async (companyName: string) => {
        const inputData = {
          in: {
            ...dummyRawData,
            base_name: `${companyName} 本社`,
          },
          out: [],
        };

        const expectedOutput = {
          ...inputToOutput(inputData),
          value: '本社',
        };

        const result = await NormalizeBusinessLocationNameStep(inputData);

        expect(result.out[0]).toEqual(expectedOutput);
      },
    );
  });

  describe.skip('5. (株)表記にも対応できる', () => {
    it.each(['(株)Sansan', 'Sansan(株)'])('%s', async (companyName: string) => {
      const inputData = {
        in: {
          ...dummyRawData,
          base_name: `${companyName} 本社`,
        },
        out: [],
      };

      const expectedOutput = {
        ...inputToOutput(inputData),
        value: '本社',
      };

      const result = await NormalizeBusinessLocationNameStep(inputData);

      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe.skip('ボーナスワーク: 拠点名に法人名が含まれている場合、法人名を除去する（空白なし）', () => {
    it.each(['株式会社Sansan', 'Sansan株式会社'])(
      '%s',
      async (companyName: string) => {
        const inputData = {
          in: {
            ...dummyRawData,
            company_name: companyName,
            base_name: `${companyName}本社`,
          },
          out: [],
        };

        const expectedOutput = {
          ...inputToOutput(inputData),
          value: '本社',
        };

        const result = await NormalizeBusinessLocationNameStep(inputData);

        expect(result.out[0]).toEqual(expectedOutput);
      },
    );

    it.each(['(株)Sansan', 'Sansan(株)'])('%s', async (companyName: string) => {
      const inputData = {
        in: {
          ...dummyRawData,
          company_name: companyName,
          base_name: `${companyName}本店`,
        },
        out: [],
      };

      const expectedOutput = {
        ...inputToOutput(inputData),
        value: '本社',
      };

      const result = await NormalizeBusinessLocationNameStep(inputData);

      expect(result.out[0]).toEqual(expectedOutput);
    });
  });
});
