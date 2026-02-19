import { FC } from 'react';

const AdminOverview: FC = () => {
    return (
        <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
                Welcome back, Admin. Overview of the system status and recent activities.
            </p>
        </div>
    );
};

export default AdminOverview;
