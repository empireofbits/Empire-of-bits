"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, Lock, Clock, CheckCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";

interface PointsVestingProps {
  totalPoints: number;
}

interface VestedPoints {
  id: string;
  amount: number;
  duration: number; // in months
  startDate: Date;
  endDate: Date;
  reward: number;
  status: "active" | "completed";
}

export default function PointsVesting({ totalPoints }: PointsVestingProps) {
  const [vestAmount, setVestAmount] = useState("");
  const [vestDuration, setVestDuration] = useState("3");
  const [vestedPoints, setVestedPoints] = useState<VestedPoints[]>(() => {
    // Load from localStorage
    const saved = localStorage.getItem("vestedPoints");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const availablePoints =
    totalPoints -
    vestedPoints.reduce((acc, curr) => {
      if (curr.status === "active") {
        return acc + curr.amount;
      }
      return acc;
    }, 0);

  const getRewardRate = (duration: number) => {
    switch (duration) {
      case 1:
        return 0.1; // 10%
      case 3:
        return 0.2; // 20%
      case 6:
        return 0.5; // 50%
      default:
        return 0.2;
    }
  };

  const handleVest = () => {
    const amount = Number.parseInt(vestAmount);
    if (isNaN(amount) || amount <= 0 || amount > availablePoints) {
      return;
    }

    const duration = Number.parseInt(vestDuration);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    const rewardRate = getRewardRate(duration);
    const reward = Math.floor(amount * rewardRate);

    const newVestedPoints: VestedPoints = {
      id: Date.now().toString(),
      amount,
      duration,
      startDate,
      endDate,
      reward,
      status: "active",
    };

    const updatedVestedPoints = [...vestedPoints, newVestedPoints];
    setVestedPoints(updatedVestedPoints);
    localStorage.setItem("vestedPoints", JSON.stringify(updatedVestedPoints));
    setVestAmount("");
  };

  const calculateProgress = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();

    if (elapsed >= total) return 100;
    return Math.floor((elapsed / total) * 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleClaimReward = (id: string) => {
    const updatedVestedPoints = vestedPoints.map((point) => {
      if (point.id === id) {
        return { ...point, status: "completed" as const };
      }
      return point;
    });

    setVestedPoints(updatedVestedPoints);
    localStorage.setItem("vestedPoints", JSON.stringify(updatedVestedPoints));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="terminal-section border border-white p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vesting form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg text-white font-mono mb-2 border-b border-white pb-1">
            LOCK YOUR POINTS
          </h3>

          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-300 font-mono">
              AVAILABLE POINTS
            </span>
            <span className="text-sm text-white font-mono">
              {formatNumber(availablePoints)}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300 font-mono">
              AMOUNT TO LOCK
            </label>
            <Input
              type="number"
              value={vestAmount}
              onChange={(e) => setVestAmount(e.target.value)}
              min="1"
              max={availablePoints.toString()}
              className="bg-black border border-white text-white p-2 font-mono"
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300 font-mono">
              LOCK DURATION
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className={`font-mono ${
                  vestDuration === "1"
                    ? "bg-white text-black border border-white"
                    : "bg-black text-white border border-white"
                }`}
                onClick={() => setVestDuration("1")}
              >
                1 MONTH
              </Button>
              <Button
                variant="outline"
                className={`font-mono ${
                  vestDuration === "3"
                    ? "bg-white text-black border border-white"
                    : "bg-black text-white border border-white"
                }`}
                onClick={() => setVestDuration("3")}
              >
                3 MONTHS
              </Button>
              <Button
                variant="outline"
                className={`font-mono ${
                  vestDuration === "6"
                    ? "bg-white text-black border border-white"
                    : "bg-black text-white border border-white"
                }`}
                onClick={() => setVestDuration("6")}
              >
                6 MONTHS
              </Button>
            </div>
          </div>

          <div className="bg-black border border-white p-3">
            <div className="flex justify-between">
              <span className="text-xs text-gray-300 font-mono">
                REWARD RATE
              </span>
              <span className="text-xs text-white font-mono">
                +{getRewardRate(Number.parseInt(vestDuration)) * 100}%
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-300 font-mono">
                POTENTIAL REWARD
              </span>
              <span className="text-xs text-white font-mono">
                +
                {formatNumber(
                  Math.floor(
                    Number.parseInt(vestAmount || "0") *
                      getRewardRate(Number.parseInt(vestDuration))
                  )
                )}
              </span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full bg-black hover:bg-white hover:text-black text-white border border-white font-mono"
              onClick={handleVest}
              disabled={
                !vestAmount ||
                Number.parseInt(vestAmount) <= 0 ||
                Number.parseInt(vestAmount) > availablePoints
              }
            >
              <Lock className="h-4 w-4 mr-2" />
              LOCK POINTS
            </Button>
          </motion.div>
        </motion.div>

        {/* Active vesting */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg text-white font-mono mb-2 border-b border-white pb-1">
            ACTIVE LOCKS
          </h3>

          {vestedPoints.length === 0 ? (
            <div className="text-sm text-gray-300 font-mono">
              NO ACTIVE LOCKS
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {vestedPoints.map((point, index) => (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-3 border ${
                    point.status === "active" ? "border-white" : "border-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {point.status === "active" ? (
                        <Lock className="h-4 w-4 text-white mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-white mr-2" />
                      )}
                      <span className="text-sm font-mono text-white">
                        {formatNumber(point.amount)} POINTS
                      </span>
                    </div>
                    <span className="text-xs font-mono text-white">
                      {point.duration} MONTH{point.duration > 1 ? "S" : ""}
                    </span>
                  </div>

                  {point.status === "active" && (
                    <>
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-300 font-mono">
                            PROGRESS
                          </span>
                          <span className="text-xs text-white font-mono">
                            {calculateProgress(point.startDate, point.endDate)}%
                          </span>
                        </div>
                        <div className="w-full h-2 border border-white relative">
                          <div
                            className="absolute top-0 left-0 h-full bg-white"
                            style={{
                              width: `${calculateProgress(
                                point.startDate,
                                point.endDate
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-2">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 text-white mr-1" />
                          <span className="text-xs text-gray-300 font-mono">
                            ENDS: {formatDate(point.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Coins className="h-3 w-3 text-white mr-1" />
                          <span className="text-xs text-white font-mono">
                            +{formatNumber(point.reward)}
                          </span>
                        </div>
                      </div>

                      {calculateProgress(point.startDate, point.endDate) >=
                        100 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 bg-black hover:bg-white hover:text-black text-white border border-white font-mono text-xs"
                            onClick={() => handleClaimReward(point.id)}
                          >
                            <Coins className="h-3 w-3 mr-1" />
                            CLAIM REWARD
                          </Button>
                        </motion.div>
                      )}
                    </>
                  )}

                  {point.status === "completed" && (
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-300 font-mono">
                        COMPLETED
                      </span>
                      <div className="flex items-center">
                        <Coins className="h-3 w-3 text-white mr-1" />
                        <span className="text-xs text-white font-mono">
                          +{formatNumber(point.reward)} CLAIMED
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
