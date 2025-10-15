import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const PrivacyPolicyPage: React.FC = () => {
    const { t } = useLocalization();

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700 first-of-type:border-t-0 first-of-type:pt-0">{title}</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">{children}</div>
        </section>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl shadow-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{t('privacy.title')}</h1>
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <p>{t('privacy.effective_date')}</p>
                        <p>{t('privacy.owner')}</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                        <p>{t('privacy.welcome')}</p>
                        <p>{t('privacy.intro')}</p>
                    </div>

                    <Section title={t('privacy.section1.title')}>
                        <p>{t('privacy.section1.content')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('privacy.section1.point1')}</li>
                            <li>{t('privacy.section1.point2')}</li>
                            <li>{t('privacy.section1.point3')}</li>
                        </ul>
                    </Section>

                    <Section title={t('privacy.section2.title')}>
                        <p>{t('privacy.section2.content')}</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('privacy.section2.point1')}</li>
                            <li>{t('privacy.section2.point2')}</li>
                            <li>{t('privacy.section2.point3')}</li>
                            <li>{t('privacy.section2.point4')}</li>
                             <li>{t('privacy.section2.point5')}</li>
                        </ul>
                    </Section>

                    <Section title={t('privacy.section3.title')}>
                        <p>{t('privacy.section3.content')}</p>
                         <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('privacy.section3.point1')}</li>
                            <li>{t('privacy.section3.point2')}</li>
                        </ul>
                    </Section>
                    
                    <Section title={t('privacy.section4.title')}>
                        <p>{t('privacy.section4.content1')}</p>
                        <p>{t('privacy.section4.content2')}</p>
                    </Section>

                    <Section title={t('privacy.section5.title')}>
                        <p>{t('privacy.section5.content')}</p>
                         <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('privacy.section5.point1')}</li>
                            <li>{t('privacy.section5.point2')}</li>
                            <li>{t('privacy.section5.point3')}</li>
                        </ul>
                    </Section>

                    <Section title={t('privacy.section6.title')}>
                        <p>{t('privacy.section6.content')}</p>
                    </Section>

                    <Section title={t('privacy.section7.title')}>
                        <p>{t('privacy.section7.content')}</p>
                        <div className="text-gray-700 dark:text-gray-300">
                             <span className="font-semibold">{t('privacy.contact.email')}:</span>
                             <a href="mailto:mohdali.mj86@gmail.com" className="ml-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">mohdali.mj86@gmail.com</a>
                        </div>
                         <div className="text-gray-700 dark:text-gray-300">
                             <span className="font-semibold">{t('privacy.contact.website')}:</span>
                             <a href="https://www.yalla.ge" target="_blank" rel="noopener noreferrer" className="ml-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">www.yalla.ge</a>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;