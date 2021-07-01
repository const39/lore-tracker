// TODO language change not fully implemented yet

// import en from "../locale/en";
import fr from "../locale/fr";

const locales = {fr};
const fallback = 'fr';
let current = 'fr';

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
        
        const text = getNestedProperty(locales[current], key) || getNestedProperty(locales[fallback], key);
        if(text) return text;
        else {

            if(process.env.NODE_ENV === 'production') return '';
            else throw new Error(
                        `LocaleError: Key '${key}' not found in current locale '${current}' nor in fallback locale '${fallback}.'`
                    );
        }

    }
}