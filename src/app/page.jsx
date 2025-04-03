"use client";
import React, { useState, useEffect } from "react";

function MainComponent() {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const mockData = [
    {
      id: 1,
      name: "Amazon プライム会員登録",
      currentPoints: 2000,
      previousPoints: 1800,
      category: "service",
      history: [
        { date: "2025-01-01", points: 1500 },
        { date: "2025-02-01", points: 1800 },
        { date: "2025-03-01", points: 2000 },
      ],
      lastUpdated: "2025-03-01T12:00:00",
    },
    {
      id: 2,
      name: "楽天カード発行",
      currentPoints: 13000,
      previousPoints: 14000,
      category: "credit",
      history: [
        { date: "2025-01-01", points: 15000 },
        { date: "2025-02-01", points: 14000 },
        { date: "2025-03-01", points: 13000 },
      ],
      lastUpdated: "2025-03-01T12:00:00",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCampaigns(mockData);
      } catch (err) {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-red-500 text-center p-4 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-inter">
            ハピタス案件価格推移
          </h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="案件を検索..."
                className="w-full p-3 rounded-lg border border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
            <select className="p-3 rounded-lg border border-gray-200">
              <option value="">全てのカテゴリー</option>
              <option value="credit">クレジットカード</option>
              <option value="shopping">ショッピング</option>
              <option value="service">サービス登録</option>
            </select>
            <select className="p-3 rounded-lg border border-gray-200">
              <option value="7">1週間</option>
              <option value="30">1ヶ月</option>
              <option value="90">3ヶ月</option>
              <option value="all">全期間</option>
            </select>
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 p-6 rounded-lg h-24"
              ></div>
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-700">案件が見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                価格推移グラフ
              </h2>
              <div className="h-80 relative">
                {selectedCampaign &&
                  selectedCampaign.history.map((point, index, array) => {
                    if (index === array.length - 1) return null;
                    const nextPoint = array[index + 1];
                    return (
                      <div
                        key={point.date}
                        className="absolute bottom-0 border-b-2 border-blue-500"
                        style={{
                          left: `${(index / (array.length - 1)) * 100}%`,
                          height: `${(point.points / 15000) * 100}%`,
                          width: `${100 / (array.length - 1)}%`,
                        }}
                      ></div>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        最終更新:{" "}
                        {new Date(campaign.lastUpdated).toLocaleDateString(
                          "ja-JP"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row md:flex-col items-end gap-4 md:gap-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {campaign.currentPoints.toLocaleString()}P
                      </div>
                      <div
                        className={`text-sm ${
                          campaign.currentPoints >= campaign.previousPoints
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <i
                          className={`fas fa-arrow-${
                            campaign.currentPoints >= campaign.previousPoints
                              ? "up"
                              : "down"
                          } mr-1`}
                        ></i>
                        {Math.abs(
                          campaign.currentPoints - campaign.previousPoints
                        ).toLocaleString()}
                        P
                      </div>
                      <div className="text-xs text-gray-500">
                        最高値:{" "}
                        {Math.max(
                          ...campaign.history.map((h) => h.points)
                        ).toLocaleString()}
                        P
                        <br />
                        最安値:{" "}
                        {Math.min(
                          ...campaign.history.map((h) => h.points)
                        ).toLocaleString()}
                        P
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;