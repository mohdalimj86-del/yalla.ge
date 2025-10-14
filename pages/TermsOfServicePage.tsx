import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const TermsOfServicePage: React.FC = () => {
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
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{t('terms.title')}</h1>
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <p>{t('terms.effective_date')}</p>
                        <p>{t('terms.owner')}</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                        <p>{t('terms.welcome')}</p>
                        <p>{t('terms.agreement')}</p>
                    </div>

                    <Section title={t('terms.section1.title')}>
                        <p>{t('terms.section1.content')}</p>
                    </Section>

                    <Section title={t('terms.section2.title')}>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('terms.section2.point1')}</li>
                            <li>{t('terms.section2.point2')}</li>
                            <li>{t('terms.section2.point3')}</li>
                        </ul>
                    </Section>

                    <Section title={t('terms.section3.title')}>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('terms.section3.point1')}</li>
                            <li>{t('terms.section3.point2')}</li>
                            <li>{t('terms.section3.point3')}</li>
                        </ul>
                    </Section>

                    <Section title={t('terms.section4.title')}>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>{t('terms.section4.point1')}</li>
                            <li>{t('terms.section4.point2')}</li>
                            <li>{t('terms.section4.point3')}</li>
                        </ul>
                    </Section>

                    <Section title={t('terms.section5.title')}>
                        <p>{t('terms.section5.content1')}</p>
                        <p>{t('terms.section5.content2')}</p>
                    </Section>
                    
                    <Section title={t('terms.section6.title')}>
                        <p>{t('terms.section6.content')}</p>
                    </Section>

                    <Section title={t('terms.section7.title')}>
                        <p>{t('terms.section7.content')}</p>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
