import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function CommonModal({ isOpen, onClose, title, body, children, size = 'md', closeButton = true, overlayClose = true, animation = 'fade', customHeader, customFooter }) {

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        }

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full mx-4'
    };

    const animationClasses = {
        fade: 'animate-fadeIn',
        slide: 'animate-slideIn',
        bounce: 'animate-bounceIn'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">

            <div
                className={`fixed inset-0 bg-black/50 transition-opacity ${animationClasses[animation]}`}
                onClick={overlayClose ? onClose : undefined}
            ></div>

            <div className="flex items-center justify-center min-h-screen p-4">
                <div
                    className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} ${animationClasses[animation]}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {customHeader || (
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                            {closeButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="p-4 overflow-y-auto max-h-[70vh]">
                        {typeof body === 'function' ? body() : body}
                    </div>

                    {customFooter && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            {typeof customFooter === 'function' ? customFooter() : customFooter}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

CommonModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    body: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
    ]),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
    closeButton: PropTypes.bool,
    overlayClose: PropTypes.bool,
    animation: PropTypes.oneOf(['fade', 'slide', 'bounce']),
    customHeader: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
    ]),
    customFooter: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
    ])
};

export default CommonModal