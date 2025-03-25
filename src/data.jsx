// Feedback
export const systemFeedbacks = [
    { id: 1, message: "🚧 Road blockage near downtown", category: "Traffic Reports", name: "System", email: "N/A", status: "Pending" },
    { id: 2, message: "🗑️ Overflowing garbage at Sector 5", category: "Waste Issues", name: "System", email: "N/A", status: "Reviewed" },
    { id: 3, message: "🌊 Flood alert in North Street", category: "Flood Warnings", name: "System", email: "N/A", status: "Resolved" },
];

export const userFeedbacks = [
    { id: 101, message: "Great service!", category: "General", name: "John Doe", email: "john@example.com", status: "Pending", remark: "" },
    { id: 102, message: "Need more waste bins in my area.", category: "Waste Issues", name: "Jane Smith", email: "jane@example.com", status: "Pending", remark: "" },
    { id: 103, message: "Streetlights not working in Taman Emas.", category: "Infrastructure", name: "David Lee", email: "david@example.com", status: "Reviewed", remark: "" },
]

export function calcResolvedCase(systemFeedbacks, userFeedbacks) {
    const feedback = [...systemFeedbacks, ...userFeedbacks];
    let resolvedCount = 0
    feedback.forEach(fb => {
        if (fb.status == "Resolved" || fb.status == "Reviewed") {
            resolvedCount++;
        }
    });
    const totalFeedback = feedback.length;
    const percentage = totalFeedback > 0 ? (resolvedCount / totalFeedback) * 100 : 0;

    return `${percentage.toFixed(2)}%`;
}

// Home Page Statistics Data
export const statsData = [
    { category: "Traffic Reports", value: "245 Cases" },
    { category: "Waste Issues", value: "32 Pending" },
    { category: "Flood Warnings", value: "7 Alerts" },
    { category: "Resolved Cases", value: calcResolvedCase(systemFeedbacks, userFeedbacks) },
];

export const chartData = {
    traffic: [
        { zone: "Kuala Lumpur", value: 50, timestamp: "2024-03-01 08:30 AM" },
        { zone: "Petaling Jaya", value: 30, timestamp: "2024-03-02 09:15 AM" },
        { zone: "Shah Alam", value: 20, timestamp: "2024-03-03 07:45 AM" },
        { zone: "Penang", value: 45, timestamp: "2024-03-04 10:00 AM" },
        { zone: "Johor Bahru", value: 35, timestamp: "2024-03-05 11:30 AM" },
        { zone: "Ipoh", value: 40, timestamp: "2024-03-06 06:50 AM" },
        { zone: "Kota Kinabalu", value: 55, timestamp: "2024-03-07 12:10 PM" },
    ],
    waste: [
        { area: "KL City Centre", value: 85, timestamp: "2024-03-01 06:00 AM" },
        { area: "Ampang", value: 78, timestamp: "2024-03-02 07:10 AM" },
        { area: "Cheras", value: 80, timestamp: "2024-03-03 05:30 AM" },
        { area: "Subang Jaya", value: 90, timestamp: "2024-03-04 08:15 AM" },
        { area: "Cyberjaya", value: 88, timestamp: "2024-03-05 09:45 AM" },
    ],
    flood: [
        { region: "Klang Valley", value: 60, timestamp: "2024-03-01 03:00 PM" },
        { region: "East Coast (Kelantan, Terengganu, Pahang)", value: 90, timestamp: "2024-03-02 02:45 PM" },
        { region: "Penang", value: 40, timestamp: "2024-03-03 01:30 PM" },
        { region: "Sarawak", value: 30, timestamp: "2024-03-04 04:00 PM" },
    ],
};


// Proposal Data
export const proposalsData = [
    {
        id: 1,
        title: "Traffic Regulation Update",
        description: "Proposal to enforce stricter speed limits in residential areas to reduce accidents.",
        votes: 45,
        file: "/files/Traffic_Regulations.pdf",
        comments: [
            {
                user: {
                    id: 'user1',
                    name: "Alice Johnson",
                    avatarUrl: "https://ui-avatars.com/api/?name=Alice+Johnson&background=random",
                },
                text: "The traffic is truly troubling the life.",
                timestamp: "10/01/2023, 02:30:00 PM",
                replies: [
                    {
                        user: {
                            id: 'user2',
                            name: "Bob Smith",
                            avatarUrl: "https://ui-avatars.com/api/?name=Bob+Smith&background=random",
                        },
                        text: "Nahhhh!",
                        timestamp: "10/01/2023, 03:00:00 PM",
                    },
                    {
                        user: {
                            id: 'user3',
                            name: "Charlie Brown",
                            avatarUrl: "https://ui-avatars.com/api/?name=Charlie+Brown&background=random",
                        },
                        text: "😒",
                        timestamp: "10/01/2023, 03:05:00 PM",
                    },
                ],
            },
            {
                user: {
                    id: 'user4',
                    name: "Diana Prince",
                    avatarUrl: "https://ui-avatars.com/api/?name=Diana+Prince&background=random",
                },
                text: "Love this proposal!!! 🔥",
                timestamp: "10/01/2023, 04:00:00 PM",
                replies: [],
            },
        ],
    },
    {
        id: 2,
        title: "Waste Management Reform",
        description: "Introducing a new recycling initiative to promote sustainable waste disposal.",
        votes: 23,
        file: "/files/Waste_Management.pdf",
        comments: [
            {
                user: {
                    id: 'user5',
                    name: "Eve Adams",
                    avatarUrl: "https://ui-avatars.com/api/?name=Eve+Adams&background=random",
                },
                text: "Great proposal!",
                timestamp: "10/02/2023, 09:30:00 AM",
                replies: [
                    {
                        user: {
                            id: 'user6',
                            name: "Frank Castle",
                            avatarUrl: "https://ui-avatars.com/api/?name=Frank+Castle&background=random",
                        },
                        text: "I agree!",
                        timestamp: "10/02/2023, 10:00:00 AM",
                    },
                    {
                        user: {
                            id: 'user7',
                            name: "Grace Lee",
                            avatarUrl: "https://ui-avatars.com/api/?name=Grace+Lee&background=random",
                        },
                        text: "Good point.",
                        timestamp: "10/02/2023, 10:05:00 AM",
                    },
                ],
            },
            {
                user: {
                    id: 'user8',
                    name: "Hannah Brown",
                    avatarUrl: "https://ui-avatars.com/api/?name=Hannah+Brown&background=random",
                },
                text: "Needs more details.",
                timestamp: "10/02/2023, 11:00:00 AM",
                replies: [],
            },
        ],
    },
    {
        id: 3,
        title: "Public Transport Expansion",
        description: "Plan to add new bus routes and optimize existing ones to ease congestion.",
        file: "/files/Public_Transport_Expansion.doc",
        votes: 8,
        comments: [
            {
                user: {
                    id: 'user9',
                    name: "Ian Wright",
                    avatarUrl: "https://ui-avatars.com/api/?name=Ian+Wright&background=random",
                },
                text: "Support bruh 😎",
                timestamp: "10/03/2023, 12:30:00 PM",
                replies: [
                    {
                        user: {
                            id: 'user10',
                            name: "Jackie Chan",
                            avatarUrl: "https://ui-avatars.com/api/?name=Jackie+Chan&background=random",
                        },
                        text: "YAYYYYY!",
                        timestamp: "10/03/2023, 12:35:00 PM",
                    },
                    {
                        user: {
                            id: 'user11',
                            name: "Kathy Smith",
                            avatarUrl: "https://ui-avatars.com/api/?name=Kathy+Smith&background=random",
                        },
                        text: "I wanna know more!🖐️",
                        timestamp: "10/03/2023, 12:40:00 PM",
                    },
                ],
            },
            {
                user: {
                    id: 'user12',
                    name: "Liam Neeson",
                    avatarUrl: "https://ui-avatars.com/api/?name=Liam+Neeson&background=random",
                },
                text: "Your proposal is complete and detailed. Well done!!!",
                timestamp: "10/03/2023, 01:00:00 PM",
                replies: [],
            },
        ],
    },
];

// Get current login user
export const currentLoginUser = [
    {
        id: 'user1',
        name: "Charlie Brown",
        username: "Charlie",
        avatarUrl: "https://ui-avatars.com/api/?name=Charlie+Brown&background=random",
        password: '123',
        redirect: '/homepage',
        role: "user",
        dob: "2004-03-12",
        address: "123, Jalan XYZ, Taman Bahagia, Kuala Lumpur, Malaysia",
        icNum: "012345-13-4566"
    },
    {
        id: 'user2',
        name: "admin",
        username: "admin",
        avatarUrl: "https://ui-avatars.com/api/?name=Diana+Prince&background=random",
        password: 'admin123',
        redirect: '/admin_page',
        role: "admin",
        dob: "2000-01-24",
        address: "123, Jalan XYZ, Taman Bahagia, Kuala Lumpur, Malaysia",
        icNum: "012345-13-4566"
    },
];

// export function getRandomUser() {
//     const randomIndex = Math.floor(Math.random() * currentLoginUser.length);
//     return currentLoginUser[randomIndex];
// }

// {
//     id: 'user1',
//     name: "Alice Johnson",
//     avatarUrl: "https://ui-avatars.com/api/?name=Alice+Johnson&background=random"
// },
// {
//     id: 'user2',
//     name: "Bob Smith",
//     avatarUrl: "https://ui-avatars.com/api/?name=Bob+Smith&background=random"
// },
// {
//     id: 'user4',
//     name: "Diana Prince",
//     avatarUrl: "https://ui-avatars.com/api/?name=Diana+Prince&background=random"
// },