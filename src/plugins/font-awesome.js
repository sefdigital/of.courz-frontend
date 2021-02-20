import { config, library } from "@fortawesome/fontawesome-svg-core";
import {
    faAngleDoubleLeft,
    faAngleDoubleRight, faBookOpen,
    faCalendarDay,
    faChevronDown,
    faClock,
    faEllipsisH,
    faFilter,
    faFire,
    faMapMarkerAlt,
    faMinus,
    faPlus,
    faSearch,
    faStar,
    faTags,
    faUserClock,
    faUserFriends,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {
    faInstagram
} from "@fortawesome/free-brands-svg-icons";

export function setupFontAwesome() {
    config.autoAddCss = false;
    library.add(faPlus, faMinus, faEllipsisH, faFire, faInstagram, faUserFriends, faFilter, faSearch, faBookOpen, faUsers, faCalendarDay, faUserClock, faTags, faClock, faMapMarkerAlt, faAngleDoubleRight, faAngleDoubleLeft, faStar, faChevronDown);
}