import React from 'react';

export function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
            <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-4xl">
                    <h2 className="mb-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">ChefNextとは</h2>
                </div>

                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-8">
                        <h3 className="mb-4">私たちのビジョン</h3>
                        <p className="text-[#1C1C1C]/70 leading-relaxed mb-6">
                            ChefNextは、料理人のキャリアを「学びと成長」を中心に再定義する
                            次世代のマッチングプラットフォームです。単なる求人サービスではなく、
                            料理人としての技術向上、人間的な成長、そして独立への道のりを
                            全面的にサポートします。
                        </p>
                        <p className="text-[#1C1C1C]/70 leading-relaxed">
                            「次の一皿が、次のステージへ。」<br />
                            あなたの情熱と技術を、次の世代へ。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
                            <div className="w-12 h-12 bg-[#CDAE58] rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h4 className="mb-3">スキル重視のマッチング</h4>
                            <p className="text-[#1C1C1C]/70 leading-relaxed">
                                経験年数ではなく、習得スキルと成長意欲を重視したマッチング
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
                            <div className="w-12 h-12 bg-[#CDAE58] rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">📈</span>
                            </div>
                            <h4 className="mb-3">成長の可視化</h4>
                            <p className="text-[#1C1C1C]/70 leading-relaxed">
                                スキルツリーとレビューシステムで成長過程を可視化
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
                            <div className="w-12 h-12 bg-[#CDAE58] rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <h4 className="mb-3">独立支援</h4>
                            <p className="text-[#1C1C1C]/70 leading-relaxed">
                                経営ノウハウから資金支援まで、独立をトータルサポート
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
