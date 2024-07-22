import { NormalizeWorkFlowData } from 'src/types/normalize-workflow-step';
import { Attributes } from 'src/value/attribute';
import { dummyRawData } from './fixtures';
import { NormalizeAddressStep } from './normalize-address.step';

const inputToOutput = (input: NormalizeWorkFlowData) => {
  return {
    sansan_organization_code: input.in.sansan_organization_code,
    sansan_location_code: input.in.sansan_location_code,
    data_source: input.in.data_source,
    crawled_at: input.in.crawled_at,
    attribute: Attributes.ADDRESS,
  };
};

describe('NormalizeAddressStep', () => {
  describe('1. 入力値がfalsyな値の場合、outにデータを追加しない', () => {
    it.each([[null], [undefined], ['']])('%s', async (address) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out.length).toEqual(0);
    });
  });
  describe('2. 住所の正規化', () => {
    it.each([
      [
        '都道府県が補完される',
        '渋谷区神宮前五丁目52-2 青山オーバルビル 13F',
        '東京都渋谷区神宮前五丁目52-2 青山オーバルビル 13F',
      ],
      [
        '丁目を表す箇所が、漢数字 + 丁目に変換される',
        '東京都渋谷区神宮前5-52-2 青山オーバルビル 13F',
        '東京都渋谷区神宮前五丁目52-2 青山オーバルビル 13F',
      ],
      [
        '番地、号を表す数字が半角数値に変換される',
        '東京都渋谷区神宮前５−５２−２ 青山オーバルビル 13F',
        '東京都渋谷区神宮前五丁目52-2 青山オーバルビル 13F',
      ],
      [
        '号以下の全角英数が半角英数に変換される',
        '東京都渋谷区神宮前五丁目52-2 青山オーバルビル １３Ｆ',
        '東京都渋谷区神宮前五丁目52-2 青山オーバルビル 13F',
      ],
      [
        '連続したスペースはひとつの空白に変換される',
        '東京都渋谷区神宮前五丁目52-2  青山オーバルビル  13F',
        '東京都渋谷区神宮前五丁目52-2 青山オーバルビル 13F',
      ],
      [
        '先頭・末尾のスペースは半角全角問わず trim される',
        ' 　東京都渋谷区神宮前五丁目52-2 青山オーバルビル 13F 　',
        '東京都渋谷区神宮前五丁目52-2 青山オーバルビル 13F',
      ],
      [
        '全角スペースが半角スペースに変換される',
        '東京都渋谷区神宮前五丁目52-2　青山オーバルビル　13F',
        '東京都渋谷区神宮前五丁目52-2 青山オーバルビル 13F',
      ],
      [
        '全角アルファベットは半角アルファベットに変換される',
        '東京都渋谷区神宮前五丁目52-2　青山Ｏｖａｌビル　13F',
        '東京都渋谷区神宮前五丁目52-2 青山Ovalビル 13F',
      ],
      [
        '町名が英数字の場合は、漢数字に変換される',
        '北海道札幌市西区24軒2条二丁目3-3',
        '北海道札幌市西区二十四軒二条二丁目3-3',
      ],
    ])('%s', async (_case, address, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out[0]).toEqual(expectedOutput);
    });
    it.each([
      [
        '京都府京都市下京区東堀川通下魚棚下る鎌屋町39-1',
        '京都府京都市下京区鎌屋町39-1',
      ],
      [
        '京都府京都市中京区河原町二条下ル一之舟入町537-50',
        '京都府京都市中京区一之船入町537-50',
      ],
    ])('「通り」は削除される', async (address, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe('3. 康煕部首文字、および、CJK 部首補助文字は、 CJK 統合漢字に置換される', () => {
    it.each([
      [
        '⺃⺅⺇⺉⺋⺍⺎⺏⺐⼪⺒⺓⼳⺔⺖⺗⺘⺙⺛⺞⺟⺠⺡⺣⺤⺦⺨⺪⺫⺲⺭⺮⺱⺳⺹⺽⺾⺿⻀⻁⻂⻃⻄⻊⻌⻍⻏⻖⻑⾧⻒⻘⻞⻟⻤⿁⻨⻩⻫⻭⻯⻲⼀⼁⼂⼃⼄⼅⼆⼇⼈⼉⼊⼋⼌⼍⼎⼏⼐⼑⼒⼓⼔⼕⼖⼗⼘⼙⼚⼛⼜⼝⼞⼟⼠⼡⼢⼣⼤⼥⼦⼧⼨⼩⼫⼬⼭⼮⼯⼰⼱⼲⼴⼵⼶⼷⼸⼹⼺⼻⼼⼽⼾⼿⽀⽁⽂⽃⽄⽅⽆⽇⽈⽉⽊⽋⽌⽍⽎⽏⽐⽑⽒⽓⽔⽕⽖⽗⽘⽙⽚⽛⽜⽝⽞⽟⽠⽡⽢⽣⽤⽥⽦⽧⽨⽩⽪⽫⽬⽭⽮⽯⽰⽱⽲⽳⽴⽵⽶⽷⽸⽹⽺⽻⽼⽽⽾⽿⾀⾁⾂⾃⾄⾅⾆⾇⾈⾉⾊⾋⾌⾍⾎⾏⾐⾑⾒⾓⾔⾕⾖⾗⾘⾙⾚⾛⾜⾝⾞⾟⾠⾡⾢⾣⾤⾥⾦⾨⾩⾪⾫⾬⾭⾮⾯⾰⾱⾲⾳⾴⾵⾶⾷⾸⾹⾺⾻⾼⾽⾾⾿⿀⿂⿃⿄⿅⿆⿇⿈⿉⿊⿋⿌⿍⿎⿏⿐⿑⿒⿓⿔⿕',
        '乚亻𠘨刂㔾𭕄兀尣尢尢巳幺幺彑忄㣺扌攵旡歺母民氵灬爫丬犭𤴔罒罒礻𥫗罓𦉪耂𦥑艹艹艹虎衤覀西𧾷辶辶阝阝長長镸青𩙿飠鬼鬼麦黄斉歯竜亀一丨丶丿乙亅二亠人儿入八冂冖冫几凵刀力勹匕匚匸十卜卩厂厶又口囗土士夂夊夕大女子宀寸小尸屮山巛工己巾干广廴廾弋弓彐彡彳心戈戸手支攴文斗斤方无日曰月木欠止歹殳毋比毛氏气水火爪父爻爿片牙牛犬玄玉瓜瓦甘生用田疋疒癶白皮皿目矛矢石示禸禾穴立竹米糸缶网羊羽老而耒耳聿肉臣自至臼舌舛舟艮色艸虍虫血行衣襾見角言谷豆豕豸貝赤走足身車辛辰辵邑酉釆里金門阜隶隹雨靑非面革韋韭音頁風飛食首香馬骨高髟鬥鬯鬲魚鳥鹵鹿麥麻黃黍黒黹黽鼎鼓鼠鼻齊齒龍龜龠',
      ],
      ['⽝かわいいよ⽝', '犬かわいいよ犬'],
    ])('%s', async (address, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe('4. 半角カナが全角カナに変換される', () => {
    it.each([
      [
        'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾜｦﾝ',
        'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワヲン',
      ],
      [
        'ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ',
        'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ',
      ],
      ['ｧｨｩｪｫｯｬｭｮｰ', 'ァィゥェォッャュョー'],
    ])('%s', async (address, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  it.skip('5. タブ文字、改行文字、復帰文字以外の制御文字は取り除かれる', async () => {
    const inputData = {
      in: {
        ...dummyRawData,
        address:
          '東京都\x00\x01\x02\x03\x04\x05\x06\x07\x08\x0B\x0C\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\xAD\x7F港区芝公園４丁目２−８',
      },
      out: [],
    };

    const expectedOutput = {
      ...inputToOutput(inputData),
      value: '東京都港区芝公園四丁目2-8',
    };

    const result = await NormalizeAddressStep(inputData);
    expect(result.out[0]).toEqual(expectedOutput);
  });

  describe.skip('6. カタカナの建物名に半角ハイフンが含まれる場合、全角のハイフンに置換される', () => {
    it.each([
      [
        '宮城県仙台市青葉区本町一丁目13-32オ-ロラビル7F',
        '宮城県仙台市青葉区本町一丁目13-32オーロラビル7F',
      ],
      [
        '東京都江東区豊洲三丁目4-8ス-パ-ビバホ-ム1F',
        '東京都江東区豊洲三丁目4-8スーパービバホーム1F',
      ],
      [
        '東京都荒川区西日暮里二丁目19-4日暮里ニュ-ト-キョ-',
        '東京都荒川区西日暮里二丁目19-4日暮里ニュートーキョー',
      ],
      [
        '京都府宇治市宇治半白1宇治中央コミュニティ-会館2F',
        '京都府宇治市宇治半白1宇治中央コミュニティー会館2F',
      ],
      [
        '千葉県船橋市本町六丁目3-8-202グランド・ル-202号',
        '千葉県船橋市本町六丁目3-8-202グランド・ルー202号',
      ],
      [
        '石川県七尾市国分町ウ-43',
        '石川県七尾市国分町ウ-43', // 番地の区切りであるためハイフンを変換しない
      ],
      [
        '金沢市諸江町上丁ホ68-1',
        '石川県金沢市諸江町上丁ホ68-1', // 番地の区切りであるためハイフンを変換しない
      ],
      [
        '広島県広島市中区橋本町10-1橋本町510ビル-405号',
        '広島県広島市中区橋本町10-1橋本町510ビル-405号', // "ビルー" は不自然なので、ハイフンを変換しない
      ],
      [
        '千葉県浦安市日の出五丁目5-1パ-クシティ東京ベイ新浦安COCOベイモ-ル-C',
        '千葉県浦安市日の出五丁目5-1パークシティ東京ベイ新浦安COCOベイモールーC', // 建物名の区切りは変換すべきでないが、妥協
      ],
      [
        '兵庫県神戸市長田区長楽町三丁目3-7鷹取駅前ビラ-1階',
        '兵庫県神戸市長田区長楽町三丁目3-7鷹取駅前ビラー1階', // 半角が正しいが、判定が困難であるため妥協
      ],
    ])('%s', async (address, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe.skip('7. 数字番地を繋ぐハイフンが漢数字の"一"だった場合のみ、それを半角ハイフンに置換した上で正規化される', () => {
    it.each([
      ['北九州市八幡西区藤田1一1一13', '福岡県北九州市八幡西区藤田一丁目1-13'],
      ['大阪府富田林市中野町東1丁目3一13', '大阪府富田林市中野町東一丁目3-13'],
      [
        '東京都千代田区内神田1一12-12美土代ﾋﾞﾙ2F',
        '東京都千代田区内神田一丁目12-12美土代ビル2F',
      ],
      [
        '宮城県石巻市桃生町倉埣字四分一65一1',
        '宮城県石巻市桃生町倉埣字四分一65-1',
      ],
      ['東京都渋谷区桜丘町二一ｰ一二Bｰ二一四', '東京都渋谷区桜丘町21-12B-214'],
    ])('%s', async (address, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe.skip('8. カタカナのニが大字、小字になっている住所で、ニが漢数字の二になっている場合はカタカナに変換される', () => {
    it.each([
      ['石川県金沢市高柳町二12番1', '石川県金沢市高柳町ニ12-1'],
      ['石川県能美市寺井町二71-1', '石川県能美市寺井町ニ71-1'],
      ['東京都千代田区千代田二-1', '東京都千代田区千代田2-1'], // イロハ住所以外の二は変換されない
      ['石川県金沢市高柳町二-1-1', '石川県金沢市高柳町2-1-1'], // 二の後にハイフンが続く場合は変換されない
      ['石川県金沢市高柳町二丁目1-1', '石川県金沢市高柳町二丁目1-1'], // 二の後に丁目が続く場合は変換されない
      // 二の後に数字が続く場合、イロハ住所か番地か判断ができない。
      // ニに変換されてしまうが、郵便物が届くか基準だと届くと思われるため特に対応はしない。
      ['石川県金沢市保古町二三-13', '石川県金沢市保古町ニ3-13'],
    ])('%s', async (address, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out[0]).toEqual(expectedOutput);
    });
  });

  describe.skip('ボーナスワーク: 浜松市の住所改編等が考慮され、新旧住所関係なく正規化を行い、新しい住所に統一される', () => {
    it.each([
      ['静岡県浜松市中区中沢町１０番１号', '静岡県浜松市中央区中沢町10-1'],
      ['静岡県浜松市中央区中沢町１０番１号', '静岡県浜松市中央区中沢町10-1'],
      ['浜松市東区篠ケ瀬町１２９５番地１', '静岡県浜松市中央区篠ケ瀬町1295-1'],
      ['静岡県浜松市北区三方原町５１６−２', '静岡県浜松市中央区三方原町516-2'],
      ['浜松市北区細江町中川２０３６−１', '静岡県浜松市浜名区細江町中川2036−1'],
      ['兵庫県篠山市河原町２２６番地の２', '兵庫県丹波篠山市河原町226-2'],
    ])('%s', async (address, expected) => {
      const inputData = {
        in: {
          ...dummyRawData,
          address: address,
        },
        out: [],
      };
      const expectedOutput = {
        ...inputToOutput(inputData),
        value: expected,
      };
      const result = await NormalizeAddressStep(inputData);
      expect(result.out[0]).toEqual(expectedOutput);
    });
  });
});
