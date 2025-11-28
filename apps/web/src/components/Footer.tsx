import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-[#FAF8F4] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-[#CDAE58] mb-4">ChefNext</h4>
            <p className="text-sm text-[#FAF8F4]/70">次の一皿が、次のステージへ。</p>
          </div>
          
          <div>
            <h5 className="mb-4 text-[#FAF8F4]">サービス</h5>
            <ul className="space-y-2 text-sm text-[#FAF8F4]/70">
              <li><a href="#" className="hover:text-[#CDAE58] transition-colors">求人を探す</a></li>
              <li><a href="#" className="hover:text-[#CDAE58] transition-colors">店舗として参加</a></li>
              <li><a href="#" className="hover:text-[#CDAE58] transition-colors">成長ストーリー</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="mb-4 text-[#FAF8F4]">サポート</h5>
            <ul className="space-y-2 text-sm text-[#FAF8F4]/70">
              <li><a href="#" className="hover:text-[#CDAE58] transition-colors">よくある質問</a></li>
              <li><a href="#" className="hover:text-[#CDAE58] transition-colors">お問い合わせ</a></li>
              <li><a href="#" className="hover:text-[#CDAE58] transition-colors">利用ガイド</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="mb-4 text-[#FAF8F4]">SNS</h5>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#CDAE58] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#CDAE58] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#CDAE58] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#FAF8F4]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#FAF8F4]/60">© 2024 ChefNext. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-[#FAF8F4]/60">
            <a href="#" className="hover:text-[#CDAE58] transition-colors">利用規約</a>
            <a href="#" className="hover:text-[#CDAE58] transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-[#CDAE58] transition-colors">特定商取引法</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
