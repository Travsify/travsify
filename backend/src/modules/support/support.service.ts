import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus } from './entities/support-ticket.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketRepository: Repository<SupportTicket>,
  ) {}

  async createTicket(userId: string, data: Partial<SupportTicket>): Promise<SupportTicket> {
    const ticket = this.ticketRepository.create({
      ...data,
      userId,
      status: TicketStatus.PENDING,
    });
    return this.ticketRepository.save(ticket);
  }

  async findByUserId(userId: string): Promise<SupportTicket[]> {
    return this.ticketRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<SupportTicket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async updateStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
    const ticket = await this.findById(id);
    ticket.status = status;
    return this.ticketRepository.save(ticket);
  }
}
