"use client";
import { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardBody, CardHeader } from "@heroui/react";

import { fetchDashboardSummary } from "@/slices/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

ChartJS.register(ArcElement, Tooltip, Legend);

const pieConfig = (title: string, data: Record<string, number>) => ({
    data: {
        labels: Object.keys(data),
        datasets: [
            {
                data: Object.values(data),
                backgroundColor: ["#60A5FA", "#FBBF24", "#34D399", "#EF4444"],
            },
        ],
    },
    options: {
        responsive: true,
        plugins: { legend: { position: "bottom" as const }, title: { display: true, text: title } },
    },
});

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const { summary, loading } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardSummary());
    }, []);

    if (loading || !summary) return <p>Loading dashboard...</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <Card>
                <CardHeader>Project Status</CardHeader>
                <CardBody>
                    <Pie {...pieConfig("Status", summary.status)} />
                </CardBody>
            </Card>
            <Card>
                <CardHeader>Budget Usage</CardHeader>
                <CardBody>
                    <Pie {...pieConfig("Budget", summary.budget)} />
                </CardBody>
            </Card>
            <Card>
                <CardHeader>Assignments</CardHeader>
                <CardBody>
                    <Pie {...pieConfig("Assignment", summary.assignment)} />
                </CardBody>
            </Card>
        </div>
    );
}
