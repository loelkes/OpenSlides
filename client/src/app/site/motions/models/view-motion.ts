import { Motion } from '../../../shared/models/motions/motion';
import { Category } from '../../../shared/models/motions/category';
import { User } from '../../../shared/models/users/user';
import { Workflow } from '../../../shared/models/motions/workflow';
import { WorkflowState } from '../../../shared/models/motions/workflow-state';
import { BaseModel } from '../../../shared/models/base/base-model';
import { BaseViewModel } from '../../base/base-view-model';
import { ViewMotionCommentSection } from './view-motion-comment-section';
import { MotionComment } from '../../../shared/models/motions/motion-comment';
import { Item } from 'app/shared/models/agenda/item';

export enum LineNumberingMode {
    None,
    Inside,
    Outside
}

export enum ChangeRecoMode {
    Original,
    Changed,
    Diff,
    Final
}

/**
 * Motion class for the View
 *
 * Stores a motion including all (implicit) references
 * Provides "safe" access to variables and functions in {@link Motion}
 * @ignore
 */
export class ViewMotion extends BaseViewModel {
    private _motion: Motion;
    private _category: Category;
    private _submitters: User[];
    private _supporters: User[];
    private _workflow: Workflow;
    private _state: WorkflowState;
    private _item: Item;

    /**
     * Indicates the LineNumberingMode Mode.
     * Needs to be accessed from outside
     */
    public lnMode: LineNumberingMode;

    /**
     * Indicates the Change reco Mode.
     * Needs to be accessed from outside
     */
    public crMode: ChangeRecoMode;

    /**
     * Indicates the maximum line length as defined in the configuration.
     * Needs to be accessed from outside
     */
    public lineLength: number;

    /**
     * Indicates the currently highlighted line, if any.
     * Needs to be accessed from outside
     */
    public highlightedLine: number;

    public get motion(): Motion {
        return this._motion;
    }

    public get id(): number {
        return this.motion ? this.motion.id : null;
    }

    public get identifier(): string {
        return this.motion ? this.motion.identifier : null;
    }

    public get title(): string {
        return this.motion ? this.motion.title : null;
    }

    public get text(): string {
        return this.motion ? this.motion.text : null;
    }

    public get reason(): string {
        return this.motion ? this.motion.reason : null;
    }

    public get weight(): number {
        return this.motion ? this.motion.weight : null;
    }

    public get sort_parent_id(): number {
        return this.motion ? this.motion.sort_parent_id : null;
    }

    public get category(): Category {
        return this._category;
    }

    public get agenda_item_id(): number {
        return this.motion ? this.motion.agenda_item_id : null;
    }

    public get category_id(): number {
        return this.motion && this.category ? this.motion.category_id : null;
    }

    public get submitters(): User[] {
        return this._submitters;
    }

    public get submitters_id(): number[] {
        return this.motion ? this.motion.submitters_id : null;
    }

    public get supporters(): User[] {
        return this._supporters;
    }

    public get supporters_id(): number[] {
        return this.motion ? this.motion.supporters_id : null;
    }

    public get workflow(): Workflow {
        return this._workflow;
    }

    public get state(): WorkflowState {
        return this._state;
    }

    public get state_id(): number {
        return this.motion && this.motion.state_id ? this.motion.state_id : null;
    }

    public get recommendation_id(): number {
        return this.motion && this.motion.recommendation_id ? this.motion.recommendation_id : null;
    }

    public get recommendation(): WorkflowState {
        return this.recommendation_id && this.workflow ? this.workflow.getStateById(this.recommendation_id) : null;
    }

    public get possibleRecommendations(): WorkflowState[] {
        return this.workflow
            ? this.workflow.states.filter(recommendation => recommendation.recommendation_label !== undefined)
            : null;
    }

    public get origin(): string {
        return this.motion ? this.motion.origin : null;
    }

    public get nextStates(): WorkflowState[] {
        return this.state && this.workflow ? this.state.getNextStates(this.workflow) : null;
    }

    public set supporters(users: User[]) {
        this._supporters = users;
        this._motion.supporters_id = users.map(user => user.id);
    }

    public set submitters(users: User[]) {
        this._submitters = users;
        this._motion.submitters_id = users.map(user => user.id);
    }

    public get item(): Item {
        return this._item;
    }

    public get agendaSpeakerAmount(): number {
        return this.item ? this.item.speakerAmount : null
    }

    public constructor(
        motion?: Motion,
        category?: Category,
        submitters?: User[],
        supporters?: User[],
        workflow?: Workflow,
        state?: WorkflowState,
        item?: Item,
    ) {
        super();

        this._motion = motion;
        this._category = category;
        this._submitters = submitters;
        this._supporters = supporters;
        this._workflow = workflow;
        this._state = state;
        this._item = item;

        // TODO: Should be set using a a config variable
        this.lnMode = LineNumberingMode.Outside;
        this.crMode = ChangeRecoMode.Original;
        this.lineLength = 80;

        this.highlightedLine = null;
    }

    public getTitle(): string {
        if (this.identifier) {
            return this.identifier + ' - ' + this.title;
        }
        return this.title;
    }

    /**
     * Returns the motion comment for the given section. Null, if no comment exist.
     * @param section The section to search the comment for.
     */
    public getCommentForSection(section: ViewMotionCommentSection): MotionComment {
        if (!this.motion) {
            return null;
        }
        return this.motion.comments.find(comment => comment.section_id === section.id);
    }

    /**
     * Updates the local objects if required
     * @param update
     */
    public updateValues(update: BaseModel): void {
        if (update instanceof Workflow) {
            this.updateWorkflow(update as Workflow);
        } else if (update instanceof Category) {
            this.updateCategory(update as Category);
        } else if (update instanceof Item) {
            this.updateItem(update as Item);
        }
        // TODO: There is no way (yet) to add Submitters to a motion
        //       Thus, this feature could not be tested
    }

    /**
     * Update routine for the category
     * @param update potentially the changed category. Needs manual verification
     */
    public updateCategory(update: Category): void {
        if (this.motion && update.id === this.motion.category_id) {
            this._category = update as Category;
        }
    }

    /**
     * Update routine for the workflow
     * @param update potentially the changed workflow (state). Needs manual verification
     */
    public updateWorkflow(update: Workflow): void {
        if (this.motion && update.id === this.motion.workflow_id) {
            this._workflow = update as Workflow;
        }
    }

    /**
     * Update routine for the agenda Item
     * @param update potentially the changed agenda Item. Needs manual verification
     */
    public updateItem(update: Item): void {
        if (this.motion && update.id === this.motion.agenda_item_id) {
            this._item = update as Item;
        }
    }

    public hasSupporters(): boolean {
        return !!(this.supporters && this.supporters.length > 0);
    }

    /**
     * Duplicate this motion into a copy of itself
     */
    public copy(): ViewMotion {
        return new ViewMotion(
            this._motion,
            this._category,
            this._submitters,
            this._supporters,
            this._workflow,
            this._state
        );
    }
}
