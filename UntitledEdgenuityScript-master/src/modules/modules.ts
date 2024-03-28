import preventDuplicateTabs from "./duplicate_tabs";
import preventLogout from "./prevent_logout";
import automaticLab from "./auto/automatic_lab";
import removeFrameRestrict from "./remove_frame_restrict";
import showHiddenColumns from "./show_hidden_columns";
import automaticVocab from "./auto/automatic_vocab";
import removeIntroScreensModule from './remove_intro_screen';
import activityAdvance from "./auto/activity_advance";
import automaticInstruction from './auto/automatic_instruction';
import StealthEngine from "./stealth_engine";
import automaticExam from "./auto/automatic_exam";
import automaticAssignments from "./auto/automatic_assignments"
import automaticJournalModule from "./auto/automatic_journal";
import UnlimitedBrainly from "./brainly";
import MuteSite from "./mute_site";
import askBrainlyButton from "./ask_brainly_button";

export type Module = {
    name: string;
    activate: () => any;
    deactivate: (() => any) | Function;
}

const moduleList = {
    preventDuplicateTabs,
    preventLogout,
    automaticLab,
    removeFrameRestrict,
    showHiddenColumns,
    automaticVocab,
    removeIntroScreensModule,
    activityAdvance,
    automaticInstruction,
    automaticExam,
    automaticAssignments,
    automaticJournalModule,
    StealthEngine,
    UnlimitedBrainly,
    MuteSite,
    askBrainlyButton,
}

export default moduleList;