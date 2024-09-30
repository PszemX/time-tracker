/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Play, Square, Trash2 } from "lucide-react";
import apiClient from "@/lib/apiClient";

interface TaskEntry {
	id: string;
	name: string;
	duration: number;
	date: string;
	isOngoing?: boolean;
}

interface TimerProps {
	projectId: number;
	projectName: string;
}

export default function Timer({ projectId, projectName }: TimerProps) {
	const [isRunning, setIsRunning] = useState(false);
	const [time, setTime] = useState(0);
	const [taskName, setTaskName] = useState("");
	const [taskHistory, setTaskHistory] = useState<TaskEntry[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isRunning) {
			startTimeRef.current = Date.now() - time * 1000;
			intervalRef.current = setInterval(() => {
				setTime(
					Math.floor(
						(Date.now() - (startTimeRef.current || 0)) / 1000
					)
				);
			}, 1000);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, time]);

	useEffect(() => {
		const fetchTaskHistory = async () => {
			try {
				const timeEntries: TaskEntry[] = await apiClient(
					"/api/time-entries"
				);
				const projectEntries = timeEntries.filter(
					(entry) => entry.projectId === projectId
				);
				const formattedEntries = projectEntries.map((entry) => ({
					id: entry.id.toString(),
					name: entry.description,
					duration: entry.duration,
					date: entry.date,
				}));
				setTaskHistory(formattedEntries);
			} catch (err: any) {
				console.error("Error fetching task history:", err);
				setError("Nie udało się pobrać historii zadań.");
			}
		};

		fetchTaskHistory();
	}, [projectId]);

	const handleStart = () => {
		if (!taskName.trim()) {
			setIsModalOpen(true);
			return;
		}
		startTimer();
	};

	const startTimer = () => {
		setIsRunning(true);
		const newTask: TaskEntry = {
			id: Date.now().toString(),
			name: taskName.trim(),
			duration: 0,
			date: new Date().toISOString().split("T")[0],
			isOngoing: true,
		};
		setTaskHistory([newTask, ...taskHistory]);
	};

	const handleStop = async () => {
		setIsRunning(false);

		try {
			const ongoingTask = taskHistory.find((task) => task.isOngoing);
			if (ongoingTask) {
				const timeEntry = await apiClient("/api/time-entries", {
					method: "POST",
					body: JSON.stringify({
						description: ongoingTask.name,
						duration: time,
						projectId: projectId,
					}),
				});

				const updatedHistory = taskHistory.map((task) =>
					task.isOngoing
						? {
								...task,
								duration: time,
								isOngoing: false,
								id: timeEntry.id.toString(),
						  }
						: task
				);
				setTaskHistory(updatedHistory);
			}
		} catch (err: any) {
			console.error("Error creating time entry:", err);
			setError("Failed to create time entry.");
		}

		setTaskName("");
		setTime(0);
	};

	const formatTime = (totalSeconds: number) => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	const handleRemoveTask = async (taskId: string) => {
		try {
			await apiClient("/api/time-entries", {
				method: "DELETE",
				body: JSON.stringify({ id: taskId }),
			});
			setTaskHistory(taskHistory.filter((task) => task.id !== taskId));
		} catch (err: any) {
			console.error("Error deleting task:", err);
			setError("Failed to delete time entry.");
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-center text-6xl font-bold">
					{formatTime(time)}
				</CardTitle>
				<p className="text-center text-muted-foreground">
					{projectName} - Current Task
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{error && <p className="text-red-500">{error}</p>}
				<div className="flex justify-center space-x-2">
					{!isRunning ? (
						<Button onClick={handleStart} className="w-24">
							<Play className="mr-2 h-4 w-4" /> Start
						</Button>
					) : (
						<Button
							onClick={handleStop}
							variant="secondary"
							className="w-24"
						>
							<Square className="mr-2 h-4 w-4" /> Stop
						</Button>
					)}
				</div>
				<Input
					placeholder="Task Name"
					value={taskName}
					onChange={(e) => setTaskName(e.target.value)}
					disabled={isRunning}
				/>
				<div>
					<h3 className="font-semibold mb-2">Task History</h3>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Task</TableHead>
								<TableHead>Time</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{taskHistory.map((task) => (
								<TableRow key={task.id}>
									<TableCell>{task.name}</TableCell>
									<TableCell>
										{task.isOngoing
											? "Ongoing"
											: formatDuration(task.duration)}
									</TableCell>
									<TableCell>{task.date}</TableCell>
									<TableCell>
										<Button
											variant="ghost"
											onClick={() =>
												handleRemoveTask(task.id)
											}
										>
											<Trash2 className="h-4 w-4 text-red-500" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Task Name Required</DialogTitle>
						<DialogDescription>
							Please enter a task name before starting the timer.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end">
						<Button onClick={() => setIsModalOpen(false)}>
							OK
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
