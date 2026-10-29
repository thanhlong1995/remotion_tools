import {Composition, Folder, Still} from 'remotion';
import {MyComposition} from './Composition';
import {KitaBooPromo} from './kitaboo/KitaBooPromo';
import {LAKESIDE_DURATION, LakesidePlay} from './lakeside/LakesidePlay';
import {ColorsScene} from './kitaboo/scenes/ColorsScene';
import {CtaScene} from './kitaboo/scenes/CtaScene';
import {DesignScene} from './kitaboo/scenes/DesignScene';
import {HookScene} from './kitaboo/scenes/HookScene';
import {OneTouchScene} from './kitaboo/scenes/OneTouchScene';
import {RevealScene} from './kitaboo/scenes/RevealScene';
import {SafetyScene} from './kitaboo/scenes/SafetyScene';
import {StrawScene} from './kitaboo/scenes/StrawScene';
import {calculateReadingMetadata, ReadingVideo, sceneMetadata} from './reading/ReadingVideo';
import {ChuTroSheet} from './daytro/sheets/ChuTroSheet';
import {HungSheet} from './daytro/sheets/HungSheet';
import {KhoaMuopSheet} from './daytro/sheets/KhoaMuopSheet';
import {NganBongSheet} from './daytro/sheets/NganBongSheet';
import {PropsCheck} from './daytro/sheets/PropsCheck';
import {SauSheet} from './daytro/sheets/SauSheet';
import {SideViewSheet} from './daytro/sheets/SideViewSheet';
import {ThuMochiSheet} from './daytro/sheets/ThuMochiSheet';
import {WALK_TEST_DURATION, WalkTest} from './daytro/scenes/WalkTest';
import {Ep01} from './daytro/episodes/ep01/Ep01';
import {Ep01Contact} from './daytro/episodes/ep01/Ep01Contact';
import {Ep02} from './daytro/episodes/ep02/Ep02';
import {Ep02Contact} from './daytro/episodes/ep02/Ep02Contact';
import {DURATION as EP02_DURATION} from './daytro/episodes/ep02/timeline';
import {Ep03} from './daytro/episodes/ep03/Ep03';
import {LaughTest} from './daytro/scenes/LaughTest';
import {Ep03Contact} from './daytro/episodes/ep03/Ep03Contact';
import {DURATION as EP03_DURATION} from './daytro/episodes/ep03/timeline';
import {DURATION as EP01_DURATION} from './daytro/episodes/ep01/timeline';
import {VangSheet} from './daytro/sheets/VangSheet';
import {CtaScene as ReadingCtaScene} from './reading/scenes/CtaScene';
import {HookScene as ReadingHookScene} from './reading/scenes/HookScene';
import {LessonsScene} from './reading/scenes/LessonsScene';
import {ProblemScene} from './reading/scenes/ProblemScene';
import {RemotionScene} from './reading/scenes/RemotionScene';
import {SuperpowerScene} from './reading/scenes/SuperpowerScene';
import {TrioScene} from './reading/scenes/TrioScene';
import {TtsScene} from './reading/scenes/TtsScene';
import {WorkflowScene} from './reading/scenes/WorkflowScene';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<MyComposition />
			<Composition
				id="KitaBooPromo"
				component={KitaBooPromo}
				durationInFrames={1350}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Folder name="KitaBoo-Scenes">
				<Composition
					id="KitaBoo-Hook"
					component={HookScene}
					durationInFrames={120}
					fps={30}
					width={1080}
					height={1920}
				/>
				<Composition
					id="KitaBoo-Reveal"
					component={RevealScene}
					durationInFrames={195}
					fps={30}
					width={1080}
					height={1920}
				/>
				<Composition
					id="KitaBoo-Design"
					component={DesignScene}
					durationInFrames={195}
					fps={30}
					width={1080}
					height={1920}
				/>
				<Composition
					id="KitaBoo-OneTouch"
					component={OneTouchScene}
					durationInFrames={195}
					fps={30}
					width={1080}
					height={1920}
				/>
				<Composition
					id="KitaBoo-Straw"
					component={StrawScene}
					durationInFrames={195}
					fps={30}
					width={1080}
					height={1920}
				/>
				<Composition
					id="KitaBoo-Safety"
					component={SafetyScene}
					durationInFrames={195}
					fps={30}
					width={1080}
					height={1920}
				/>
				<Composition
					id="KitaBoo-Colors"
					component={ColorsScene}
					durationInFrames={195}
					fps={30}
					width={1080}
					height={1920}
				/>
				<Composition
					id="KitaBoo-CTA"
					component={CtaScene}
					durationInFrames={165}
					fps={30}
					width={1080}
					height={1920}
				/>
			</Folder>
			<Composition
				id="AiContentReading"
				component={ReadingVideo}
				durationInFrames={2400}
				fps={30}
				width={1080}
				height={1920}
				calculateMetadata={calculateReadingMetadata}
			/>
			<Folder name="AiContentReading-Scenes">
				<Composition
					id="Reading-Hook"
					component={ReadingHookScene}
					durationInFrames={180}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('01-hook')}
				/>
				<Composition
					id="Reading-Problem"
					component={ProblemScene}
					durationInFrames={300}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('02-problem')}
				/>
				<Composition
					id="Reading-Trio"
					component={TrioScene}
					durationInFrames={180}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('03-trio')}
				/>
				<Composition
					id="Reading-Superpower"
					component={SuperpowerScene}
					durationInFrames={210}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('04-superpower')}
				/>
				<Composition
					id="Reading-TTS"
					component={TtsScene}
					durationInFrames={210}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('05-tts')}
				/>
				<Composition
					id="Reading-Remotion"
					component={RemotionScene}
					durationInFrames={210}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('06-remotion')}
				/>
				<Composition
					id="Reading-Workflow"
					component={WorkflowScene}
					durationInFrames={270}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('07-workflow')}
				/>
				<Composition
					id="Reading-Lessons"
					component={LessonsScene}
					durationInFrames={300}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('08-lessons')}
				/>
				<Composition
					id="Reading-CTA"
					component={ReadingCtaScene}
					durationInFrames={180}
					fps={30}
					width={1080}
					height={1920}
					calculateMetadata={sceneMetadata('09-cta')}
				/>
			</Folder>
			<Composition
				id="LakesidePlay"
				component={LakesidePlay}
				durationInFrames={LAKESIDE_DURATION}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Folder name="DayTro-Characters">
				<Still id="DayTro-Vang-Sheet" component={VangSheet} width={1920} height={1080} />
				<Still id="DayTro-ChuTro-Sheet" component={ChuTroSheet} width={1920} height={1080} />
				<Still id="DayTro-SideViews" component={SideViewSheet} width={1920} height={1080} />
				<Still id="DayTro-NganBong-Sheet" component={NganBongSheet} width={1920} height={1080} />
				<Still id="DayTro-KhoaMuop-Sheet" component={KhoaMuopSheet} width={1920} height={1080} />
				<Still id="DayTro-ThuMochi-Sheet" component={ThuMochiSheet} width={1920} height={1080} />
				<Still id="DayTro-Sau-Sheet" component={SauSheet} width={1920} height={1080} />
				<Still id="DayTro-Hung-Sheet" component={HungSheet} width={1920} height={1080} />
				<Still id="DayTro-PropsCheck" component={PropsCheck} width={1920} height={1080} />
			</Folder>
			<Composition id="DayTro-Ep01" component={Ep01} durationInFrames={EP01_DURATION} fps={30} width={1920} height={1080} />
			<Composition id="DayTro-Ep01-Contact" component={Ep01Contact} durationInFrames={EP01_DURATION} fps={30} width={1920} height={1080} />
			<Composition id="DayTro-Ep02" component={Ep02} durationInFrames={EP02_DURATION} fps={30} width={1920} height={1080} />
			<Composition id="DayTro-Ep02-Contact" component={Ep02Contact} durationInFrames={EP02_DURATION} fps={30} width={1920} height={1080} />
			<Composition id="DayTro-LaughTest" component={LaughTest} durationInFrames={90} fps={30} width={1920} height={1080} />
			<Composition id="DayTro-Ep03" component={Ep03} durationInFrames={EP03_DURATION} fps={30} width={1920} height={1080} />
			<Composition id="DayTro-Ep03-Contact" component={Ep03Contact} durationInFrames={EP03_DURATION} fps={30} width={1920} height={1080} />
			<Composition
				id="DayTro-WalkTest"
				component={WalkTest}
				durationInFrames={WALK_TEST_DURATION}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
