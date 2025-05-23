import prisma from '../../utils/prisma';

export interface ITestimonial {
    title: string;
    description: string;
    rating: number;
    recommendation: boolean;
    userId: string;
}

const createTestimonial = async (payload: ITestimonial) => {
    const result = await prisma.testimonial.create({ data: payload });
    return result;
};

const getAllTestimonials = async () => {
    return prisma.testimonial.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profileUrl: true,
                },
            },
        },
    });
};

const getSingleTestimonial = async (id: string) => {
    return prisma.testimonial.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profileUrl: true,
                },
            },
        },
    });
};

const deleteTestimonial = async (id: string) => {
    return prisma.testimonial.delete({ where: { id } });
};

export const TestimonialService = {
    createTestimonial,
    getAllTestimonials,
    getSingleTestimonial,
    deleteTestimonial,
};
