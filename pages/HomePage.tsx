import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';

const FeatureCard: React.FC<{ icon: string; title: string; link: string }> = ({ icon, title, link }) => {
  return (
    <Link to={link} className="group block p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl dark:hover:shadow-gray-700 hover:-translate-y-2 transition-all duration-300">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 mb-6 group-hover:bg-sky-600 group-hover:text-white dark:group-hover:text-white transition-colors">
        <i className={`fas ${icon} fa-2x`}></i>
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
    </Link>
  );
};


const HomePage: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="text-center">
      <section className="py-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          {t('home.title')}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          {t('home.subtitle')}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard icon="fa-home" title={t('home.find_accommodation')} link="/accommodation" />
        <FeatureCard icon="fa-shopping-cart" title={t('home.buy_sell')} link="/marketplace" />
        <FeatureCard icon="fa-compass" title={t('home.explore_places')} link="/explore" />
      </section>
    </div>
  );
};

export default HomePage;