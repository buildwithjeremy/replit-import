
export const createMilestoneForStep = (stepId: number) => {
  const stepData = {
    1: { title: "Welcome & Onboarding", subTasks: ["1-1", "1-2", "1-3"] },
    2: { title: "Basic Training", subTasks: ["2-1", "2-2"] },
    3: { title: "Product Knowledge", subTasks: ["3-1", "3-2"] },
    4: { title: "Field Training Basics", subTasks: ["4-1", "4-2", "4-3", "4-4"] },
    5: { title: "Advanced Training", subTasks: ["5-1", "5-2", "5-3"] },
    6: { title: "Territory Management", subTasks: ["6-1", "6-2", "6-3"] },
    7: { title: "Client Relations", subTasks: ["7-1", "7-2", "7-3"] },
    8: { title: "Leadership Development", subTasks: ["8-1", "8-2", "8-3"] },
    9: { title: "Performance Metrics", subTasks: ["9-1", "9-2", "9-3"] },
    10: { title: "Advanced Territory", subTasks: ["10-1", "10-2", "10-3"] },
    11: { title: "Training Others", subTasks: ["11-1", "11-2", "11-3"] },
    12: { title: "Independent Operations", subTasks: ["12-1", "12-2", "12-3"] },
    13: { title: "Field Trainer Certification", subTasks: ["13-1", "13-2", "13-3"] }
  };
  
  const step = stepData[stepId as keyof typeof stepData];
  if (!step) return null;
  
  return {
    stepId: stepId,
    title: step.title,
    completed: false,
    subTasks: step.subTasks.map(taskId => ({
      taskId: taskId,
      description: `Task ${taskId}`,
      completed: false,
    }))
  };
};
