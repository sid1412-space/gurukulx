
export const mockUsers = [
    {
        id: "user_admin_01",
        email: "admin@gurukulx.com",
        password: "password",
        name: "Admin User",
        role: "admin",
        avatar: "https://i.ibb.co/xqvy59YP/Chat-GPT-Image-Aug-12-2025-11-06-21-PM.png",
    },
    {
        id: 'tutor_01',
        name: 'Dr. Arwin',
        email: 'arwin@example.com',
        password: 'password',
        role: 'tutor',
        avatar: 'https://i.ibb.co/kX3Drj2/3d-illustration-person-with-sunglasses-23-2149436188.jpg',
        subjects: ['Physics', 'Mathematics'],
        bio: 'PhD in Physics with 10+ years of teaching experience at the university level. I specialize in making complex topics understandable and engaging.',
        rating: 4.9,
        price: 80,
        isOnline: true,
        isBusy: false,
        applicationDetails: {
            qualification: 'PhD in Physics',
            experience: '5+',
            expertise: 'Physics'
        }
    },
    {
        id: 'tutor_02',
        name: 'Alena Y.',
        email: 'alena@example.com',
        password: 'password',
        role: 'tutor',
        avatar: 'https://i.ibb.co/zVvL48G/3d-illustration-business-woman-holding-clipboard-with-copy-space-107791-16474.jpg',
        subjects: ['Chemistry', 'Biology'],
        bio: 'Medical student with a passion for biochemistry and organic chemistry. I help students ace their NEET exams with targeted strategies.',
        rating: 4.8,
        price: 75,
        isOnline: true,
        isBusy: false,
        applicationDetails: {
            qualification: 'MBBS (pursuing)',
            experience: '1-2',
            expertise: 'Chemistry'
        }
    },
    {
        id: 'tutor_03',
        name: 'Sanjay G.',
        email: 'sanjay@example.com',
        password: 'password',
        role: 'tutor',
        avatar: 'https://i.ibb.co/yqgC1D4/3d-illustration-person-with-glasses-23-2149436185.jpg',
        subjects: ['Mathematics'],
        bio: 'IIT graduate with a knack for breaking down complex mathematical problems. Expert in calculus and algebra for JEE preparation.',
        rating: 4.9,
        price: 90,
        isOnline: false,
        isBusy: false,
        applicationDetails: {
            qualification: 'B.Tech from IIT Delhi',
            experience: '3-4',
            expertise: 'Mathematics'
        }
    },
    {
        id: "user_student_01",
        email: "student@gurukulx.com",
        password: "password",
        name: "Rohan S.",
        role: "student",
        walletBalance: 1500,
        avatar: 'https://i.ibb.co/6PDeR78/3d-illustration-person-23-2149436182.jpg',
    }
];

export const mockTutorApplicants = [
    {
        id: "applicant_01",
        name: "Priya Singh",
        email: "priya.singh@example.com",
        applicationStatus: "Pending",
        applicationDetails: {
            expertise: "Biology",
            qualification: "M.Sc in Biotechnology",
            experience: "1-2",
        }
    },
    {
        id: "applicant_02",
        name: "Karan Verma",
        email: "karan.verma@example.com",
        applicationStatus: "Rejected",
        applicationDetails: {
            expertise: "Mathematics",
            qualification: "B.Sc in Mathematics",
            experience: "fresher",
        }
    }
];


export function initializeMockData() {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('userDatabase')) {
      localStorage.setItem('userDatabase', JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem('tutorApplicants')) {
      localStorage.setItem('tutorApplicants', JSON.stringify(mockTutorApplicants));
    }
    if (!localStorage.getItem('sessionRequests')) {
      localStorage.setItem('sessionRequests', JSON.stringify([]));
    }
     if (!localStorage.getItem('rechargeRequests')) {
      localStorage.setItem('rechargeRequests', JSON.stringify([]));
    }
     if (!localStorage.getItem('payoutRequests')) {
      localStorage.setItem('payoutRequests', JSON.stringify([]));
    }
  }
}
