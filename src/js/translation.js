import en from "../locale/en";
import fr from "../locale/fr";

const locales = {en, fr};
const defaultLocale = 'en';
let currentLocale = 'en';

function getNestedProperty(object, property) {
	const props = property.split(".");
	let currentVal = object;
	let i = 0;
	do {
        if(currentVal) currentVal = currentVal[props[i]];
		i++;

	} while (currentVal && i < props.length);

    return currentVal || "";
}

export default {


    t: function(key) {
        
        const text = getNestedProperty(locales[currentLocale], key) || getNestedProperty(locales[currentLocale], key);
        if(text) return text;
        else {

            if(process.env.NODE_ENV === 'production') return '';
            else throw new Error(
                        `LocaleError: Key '${key}' not found in current locale '${currentLocale}' nor in fallback locale '${defaultLocale}.'`
                    );
        }

    }
}