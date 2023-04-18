// company.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entities';
import { CreateCompanyDto } from '../dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async upsertCompanyEntity(
    createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    const {
      code,
      name,
      last_agm,
      market_capitalization_mn,
      authorized_capital_mn,
      paidup_capital_mn,
      type_of_instrument,
      total_outstanding_share_mn,
      face_par_value,
      sector,
      cash_dividend,
      bonus_issued_stock_dividend,
      pe,
      eps,
      listing_since,
      category,
      sponsor_director,
      govt,
      institute,
      _foreign,
      _public,
      address,
      phone,
      email,
      // created_at
    } = createCompanyDto;

    // console.log('_public', _public);

    const company = new Company();

    company.code = code;
    company.name = name;
    company.last_agm = last_agm;
    company.market_capitalization_mn = market_capitalization_mn;
    company.authorized_capital_mn = authorized_capital_mn;
    company.paidup_capital_mn = paidup_capital_mn;
    company.type_of_instrument = type_of_instrument;
    company.total_outstanding_share_mn = total_outstanding_share_mn;
    company.face_par_value = face_par_value;
    company.sector = sector;
    company.cash_dividend = cash_dividend;
    company.bonus_issued_stock_dividend = bonus_issued_stock_dividend;
    company.pe = pe;
    company.eps = eps;
    company.listing_since = listing_since;
    company.category = category;
    company.sponsor_director = sponsor_director;
    company.govt = govt;
    company.institute = institute;
    company._foreign = _foreign;
    company.public = _public;
    company.address = address;
    company.phone = phone;
    company.email = email;
    // company.created_at = date;

    const queryBuilder = this.companyRepository
      .createQueryBuilder()
      .insert()
      .into(Company)
      .values(company)
      .orUpdate([
        'name',
        'last_agm',
        'market_capitalization_mn',
        'authorized_capital_mn',
        'paidup_capital_mn',
        'type_of_instrument',
        'total_outstanding_share_mn',
        'face_par_value',
        'sector',
        'cash_dividend',
        'bonus_issued_stock_dividend',
        'pe',
        'eps',
        'listing_since',
        'category',
        'sponsor_director',
        'govt',
        'institute',
        '_foreign',
        'public',
        'address',
        'phone',
        'email',
        'created_at',
      ]);

    await queryBuilder.execute();

    const upsertedEntity = await this.companyRepository.findOneOrFail({
      where: { code: code },
    });

    return upsertedEntity;
  }
}
