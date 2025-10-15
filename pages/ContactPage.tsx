import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const ContactPage: React.FC = () => {
    const { t } = useLocalization();

    const contactInfo = [
        {
            title: t('contact.direct.title'),
            icon: 'fas fa-phone-alt',
            details: [
                { type: t('contact.phone'), value: '+995 558 504 674', href: 'tel:+995558504674' },
                { type: t('contact.phone'), value: '+995 568 282 433', href: 'tel:+995568282433' },
            ]
        },
        {
            title: t('contact.inquiries.title'),
            icon: 'fas fa-envelope',
            details: [
                { type: t('contact.email'), value: 'mohdali.mj86@gmail.com', href: 'mailto:mohdali.mj86@gmail.com' },
            ]
        },
        {
            title: t('contact.social.title'),
            icon: 'fas fa-share-alt',
            details: [
                { type: t('contact.facebook'), value: 'Yalla.ge', href: 'https://www.facebook.com/Yalla.ge', icon: 'fab fa-facebook-square' },
                { type: t('contact.instagram'), value: '@yalla.ge', href: 'https://www.instagram.com/yalla.ge', icon: 'fab fa-instagram-square' },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl shadow-md">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-6">{t('contact.title')}</h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                    {t('contact.intro')}
                </p>

                <div className="space-y-10">
                    {contactInfo.map((section, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300">
                                <i className={`${section.icon} fa-lg`}></i>
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                                <div className="mt-3 space-y-2">
                                    {section.details.map((detail, detailIndex) => (
                                        <div key={detailIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                                            {detail.icon ? (
                                                <i className={`${detail.icon} mr-3 w-5 text-center text-xl text-gray-400`}></i>
                                            ) : (
                                                 <span className="font-semibold w-20 flex-shrink-0">{detail.type}:</span>
                                            )}
                                            <a 
                                                href={detail.href} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors break-all"
                                            >
                                                {detail.value}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;