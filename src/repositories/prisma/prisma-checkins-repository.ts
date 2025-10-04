import type { Prisma, CheckIn } from '@prisma/client'
import type { CheckInsRepository } from '../check-ins-repository.js'
import { prisma } from '@/lib/prisma.js'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string): Promise<CheckIn | null> {
    const checkin = prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkin
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(), // gte = greater then or equal
          lte: endOfTheDay.toDate(), // lte =  less than or equal
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })
    return checkIns
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkin = await prisma.checkIn.create({
      data,
    })

    return checkin
  }

  async save(data: CheckIn): Promise<CheckIn> {
    const checkin = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkin
  }
}
