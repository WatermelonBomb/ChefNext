import React from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { PortfolioCard } from './PortfolioCard';
import { TrendingUp, Users, Award, ArrowRight, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const portfolioItems = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGxhdGluZyUyMGZpbmUlMjBkaW5pbmd8ZW58MXx8fHwxNzYzMDU0Mzg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: '鴨のロースト',
      description: '低温調理で仕上げた鴨胸肉とフォアグラのハーモニー',
      skills: ['火入れ', 'ソース', '盛付け']
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1566950596959-bd0b3f8c2634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGN1aXNpbmUlMjBwbGF0aW5nfGVufDF8fHx8MTc2MzA1NDM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: '季節の前菜',
      description: '日本の四季を表現した一皿',
      skills: ['盛付け', 'ソース']
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1761095596765-c8abe01d3aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZGVzc2VydCUyMHBsYXRpbmd8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'デセールアート',
      description: '視覚と味覚で楽しむデザート',
      skills: ['盛付け']
    }
  ];
  
  const growthSteps = [
    {
      icon: TrendingUp,
      title: 'スキルアップ',
      description: '一流のシェフから学び、技術を磨く'
    },
    {
      icon: Users,
      title: '出会い',
      description: '志を共にする仲間と出会う'
    },
    {
      icon: Award,
      title: '独立',
      description: '自分の店を持ち、夢を実現する'
    }
  ];
  
  const testimonials = [
    {
      name: '田中 優太',
      role: 'Chef | 修行3年目',
      comment: 'ChefNextで出会った師匠のもとで、火入れの技術を徹底的に学びました。今では自信を持って料理に向き合えます。',
      image: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      name: 'Restaurant L\'espoir',
      role: 'フレンチレストラン',
      comment: '情熱ある若手シェフとの出会いが、私たちの店に新しい風を吹き込んでくれました。',
      image: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2Mjk1NTk5MXww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1740727665746-cfe80ababc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGtpdGNoZW58ZW58MXx8fHwxNzYzMDQ3MDkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Chef cooking"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/80 via-[#1C1C1C]/50 to-[#CDAE58]/30" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-white mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold">
              学びながら働く。<br />未来のオーナーシェフへ。
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              ChefNextは、成長を中心にしたキャリアプラットフォーム。<br />
              あなたの情熱を、次のステージへ。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => onNavigate('chef-register')}
              >
                Chefとして始める
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => onNavigate('restaurant-register')}
                className="border-white text-white hover:bg-white hover:text-[#1C1C1C]"
              >
                店舗として参加
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>
      
      {/* Growth Story Section */}
      <section className="py-24 bg-white">
        <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 max-w-4xl"
          >
            <h2 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">成長の3つのステージ</h2>
            <p className="text-[#1C1C1C]/70 text-lg leading-relaxed">
              ChefNextは、あなたの料理人としての成長を全力でサポートします
            </p>
          </motion.div>

          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20 place-items-center">
            {growthSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_24px_rgba(205,174,88,0.2)]">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-3 text-xl sm:text-2xl font-semibold leading-snug">{step.title}</h3>
                <p className="text-[#1C1C1C]/70">{step.description}</p>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Portfolio Gallery Section */}
      <section className="py-32 bg-gradient-to-br from-[#FAF8F4] to-[#F4F0E6]">
        <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-4xl">
            <div className="inline-block px-6 py-2 bg-[#CDAE58]/10 rounded-full mb-6">
              <span className="text-[#CDAE58] text-sm font-medium">MASTERPIECES</span>
            </div>
            <h2 className="mb-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">作品ギャラリー</h2>
            <p className="text-[#1C1C1C]/70 text-xl leading-relaxed">
              ChefNextで成長したシェフたちの心を込めた作品
            </p>
          </div>

          <div className="w-full max-w-7xl flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-16 xl:gap-20 place-items-center">
              {portfolioItems.map((item, index) => (
                <div key={index} className="w-full max-w-sm">
                  <PortfolioCard {...item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-4xl"
          >
            <h2 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">ユーザーの声</h2>
            <p className="text-[#1C1C1C]/70 text-lg">ChefNextで出会い、成長した仲間たち</p>
          </motion.div>

          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 place-items-center">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#FAF8F4] p-10 rounded-2xl relative shadow-[0_4px_24px_rgba(205,174,88,0.1)]"
              >
                <Quote className="w-12 h-12 text-[#CDAE58]/30 mb-6" />
                <p className="text-[#1C1C1C]/80 mb-8 italic text-lg leading-relaxed">{testimonial.comment}</p>
                <div className="flex items-center gap-5">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-base sm:text-lg font-medium leading-snug">{testimonial.name}</h4>
                    <p className="text-sm text-[#1C1C1C]/60 mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-r from-[#1C1C1C] to-[#2C2C2C] text-white">
        <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <h2 className="mb-8 text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">次の一皿が、次のステージへ。</h2>
            <p className="text-white/80 mb-12 text-xl leading-relaxed">
              あなたの成長が、今日から始まります
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('chef-register')}
              className="px-12 py-4 text-lg"
            >
              今すぐ始める
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
