import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const AboutUsPage: React.FC = () => {
    const { t } = useLocalization();

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">{children}</div>
        </section>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl shadow-md space-y-10">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white">{t('about.title')}</h1>
                
                <Section title={t('about.story.title')}>
                    <p>{t('about.story.content')}</p>
                </Section>

                <Section title={t('about.mission.title')}>
                    <p>{t('about.mission.content')}</p>
                </Section>

                <Section title={t('about.what_we_offer.title')}>
                    <p>{t('about.what_we_offer.content')}</p>
                    <ul className="list-disc list-inside space-y-4 pl-4">
                        <li>
                            <strong className="font-semibold text-gray-800 dark:text-gray-200">{t('about.what_we_offer.point1_title')}:</strong> {t('about.what_we_offer.point1_content')}
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-800 dark:text-gray-200">{t('about.what_we_offer.point2_title')}:</strong> {t('about.what_we_offer.point2_content')}
                        </li>
                        <li>
                            <strong className="font-semibold text-gray-800 dark:text-gray-200">{t('about.what_we_offer.point3_title')}:</strong> {t('about.what_we_offer.point3_content')}
                        </li>
                    </ul>
                </Section>
                
                <Section title={t('about.vision.title')}>
                    <p>{t('about.vision.content')}</p>
                </Section>
            </div>
        </div>
    );
};

export default AboutUsPage;
