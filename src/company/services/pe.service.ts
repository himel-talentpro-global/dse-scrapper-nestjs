// company.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PE } from '../entities/pe.entities';
import { CreatePeDto } from '../dto/pe.dto';

@Injectable()
export class PeService {
  constructor(
    @InjectRepository(PE)
    private readonly peRepository: Repository<PE>,
  ) {}

  //!===============================================
  // CreatePeDto
  async upsertPeEntity(createPeDtos: CreatePeDto[]): Promise<void> {
    // let a = 0;
    for (const createPeDto of createPeDtos) {
      // a++;
      // console.log('createPeDtos...', createPeDto);
      // if (a == 3) {
      //   break;
      // }

      const {
        code,
        close_price,
        ycp,
        pe_1,
        pe_2,
        pe_3,
        pe_4,
        pe_5,
        pe_6,
        // date,
      } = createPeDto;

      const pe = new PE();

      pe.code = code;
      pe.close_price = close_price;
      pe.ycp = ycp;
      pe.pe_1 = pe_1;
      pe.pe_2 = pe_2;
      pe.pe_3 = pe_3;
      pe.pe_4 = pe_4;
      pe.pe_5 = pe_5;
      pe.pe_6 = pe_6;

      const queryBuilder = this.peRepository
        .createQueryBuilder()
        .insert()
        .into(PE)
        .values(pe)
        .orUpdate(
          [
            'close_price',
            'ycp',
            'pe_1',
            'pe_2',
            'pe_3',
            'pe_4',
            'pe_5',
            'pe_6',
            'updated_at',
          ],
          // [
          //   // 'code',
          //   // 'close_price',
          //   // 'ycp',
          //   // 'pe_1',
          //   // 'pe_2',
          //   // 'pe_3',
          //   // 'pe_4',
          //   // 'pe_5',
          //   // 'pe_6',
          //   // 'created_at',
          // ],
          // {
          //   skipUpdateIfNoValuesChanged: true,
          //   // indexPredicate: 'date > 2020-01-01',
          // },
        );

      await queryBuilder.execute();

      // const upsertedEntity = await this.peRepository.findOneOrFail({
      //   where: { code: code },
      // });
    }

    // return upsertedEntity;
  }
}
