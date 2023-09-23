import { useState, useEffect } from 'react';

export default () => {
    const allFeatures = ['secure', 'transparent', 'reliable'];
    const [settings, setSettings] = useState({ using: 0, dir: +1 });
    const [feature, setFeature] = useState('');

    useEffect(() => {

        if (feature.length == 0) {

        if (settings.dir == -1) {
            let using:number;
            if (settings.using + 1 == allFeatures.length) using = 0;
            else using = settings.using + 1;
            setSettings({ using, dir: 1 });
        }
        else {
            setTimeout(() => {
            setFeature(allFeatures[settings.using][0]);
            }, 100);
        }

        }

        if (feature.length == allFeatures[settings.using].length && settings.dir == 1) {

        setTimeout(() => {
            setSettings(prev => {
            prev.dir = -1;
            return { ...prev };
            });
        }, 3000);

        }

    }, [settings, feature]);

    setTimeout(() => {
        let text = allFeatures[settings.using];
        setFeature(text.slice(0, feature.length + settings.dir));
    }, 100);

    return <span className="features">{feature}</span>
}