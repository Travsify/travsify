import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kyc, KycStatus } from './entities/kyc.entity';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/entities/user.entity';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc)
    private kycRepository: Repository<Kyc>,
    private usersService: UsersService,
  ) {}

  async submitKyc(userId: string, kycData: any): Promise<Kyc> {
    let kyc = await this.kycRepository.findOne({ where: { userId } });
    if (kyc) {
      Object.assign(kyc, kycData, { status: KycStatus.PENDING });
    } else {
      kyc = (this.kycRepository.create({ ...kycData, userId, status: KycStatus.PENDING } as any) as unknown) as Kyc;
    }
    return this.kycRepository.save(kyc as any);
  }

  async getKycByUserId(userId: string): Promise<Kyc | null> {
    return this.kycRepository.findOne({ where: { userId } });
  }

  async approveKyc(kycId: string, remarks?: string): Promise<Kyc> {
    const kyc = await this.kycRepository.findOne({ where: { id: kycId }, relations: ['user'] });
    if (!kyc) throw new NotFoundException('KYC not found');

    kyc.status = KycStatus.APPROVED;
    kyc.adminRemarks = remarks || '';
    const savedKyc = await this.kycRepository.save(kyc);

    await this.usersService.updateStatus(kyc.userId, UserStatus.APPROVED);
    return savedKyc;
  }

  async rejectKyc(kycId: string, remarks: string): Promise<Kyc> {
    const kyc = await this.kycRepository.findOne({ where: { id: kycId } });
    if (!kyc) throw new NotFoundException('KYC not found');

    kyc.status = KycStatus.REJECTED;
    kyc.adminRemarks = remarks;
    const savedKyc = await this.kycRepository.save(kyc);

    await this.usersService.updateStatus(kyc.userId, UserStatus.REJECTED);
    return savedKyc;
  }
}
