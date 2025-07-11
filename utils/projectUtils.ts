import Project from "@/models/Project";

export const isEmployeeAvailable = async (employeeId: string) => {
    const project = await Project.findOne({
        assignedToEmployee: employeeId,
        status: { $in: ["TODO", "INPROGRESS"] },
        isDeleted: false,
    });

    return !project;
};
