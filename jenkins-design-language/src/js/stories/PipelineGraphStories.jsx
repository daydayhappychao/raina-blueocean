import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { PipelineGraph } from '../components/pipeline/PipelineGraph';

import { StatusIndicator } from '../components';

const validResultValues = StatusIndicator.validResultValues;

storiesOf('PipelineGraph', module)
    .add('Mixed', renderMultiParallelPipeline)
    .add('Multi-stage Parallel', renderMultiStageParallel)
    .add('Multi-stage Spacing', renderMultiStageSpacing)
    .add('Edge cases 1', renderEdgeCases1)
    .add('Long names', renderLongNames)
    .add('Duplicate Names', renderWithDuplicateNames)
    .add('Fat', renderFlatPipelineFat)
    .add('Legend', renderFlatPipeline)
    .add('Listeners', renderListenersPipeline)
    .add('Parallel', renderParallelPipeline)
    .add('Parallel (Deep)', renderParallelPipelineDeep);

function renderFlatPipeline() {

    const stages = [
        makeNode('Success', [], validResultValues.success),
        makeNode('Failure', [], validResultValues.failure),
        makeNode('Running', [], validResultValues.running),
        makeNode('Slow', [], validResultValues.running, 150),
        makeNode('Queued', [], validResultValues.queued),
        makeNode('Unstable', [], validResultValues.unstable),
        makeNode('Aborted', [], validResultValues.aborted),
        makeNode('Not Built', [], validResultValues.not_built),
        makeNode('Bad data', [], 'this is not my office'),
    ];

    // Reduce spacing just to make this graph smaller
    const layout = { nodeSpacingH: 90 };

    return <div><PipelineGraph stages={stages} layout={layout} /></div>;
}

function renderWithDuplicateNames() {

    const stages = [
        makeNode('Build'),
        makeNode('Test'),
        makeNode('Browser Tests', [
            makeNode('Internet Explorer'),
            makeNode('Chrome'),
        ]),
        makeNode('Test'),
        makeNode('Staging'),
        makeNode('Production'),
    ];

    return (
        <div>
            <PipelineGraph stages={stages} />
        </div>
    );
}

function renderFlatPipelineFat() {

    const stages = [
        makeNode('Success', [], validResultValues.success),
        makeNode('Failure', [], validResultValues.failure),
        makeNode('Running', [
            makeNode('Job 1', [], validResultValues.running),
            makeNode('Job 2', [], validResultValues.running),
            makeNode('Job 3', [], validResultValues.running),
        ]),
        makeNode('Queued', [
            makeNode('Job 4', [], validResultValues.queued),
            makeNode('Job 5', [], validResultValues.queued),
            makeNode('Job 6', [], validResultValues.queued),
            makeNode('Job 7', [], validResultValues.queued),
            makeNode('Job 8', [], validResultValues.queued),
        ]),
        makeNode('Not Built', [], validResultValues.not_built),
        makeNode('Bad data', [], 'this is not my office'),
    ];

    const layout = {
        connectorStrokeWidth: 10,
        nodeRadius: 20,
        curveRadius: 10,
    };

    return (
        <div style={{ padding: 10 }}>
            <h1>Same data, different layout</h1>
            <h3>Normal</h3>
            <PipelineGraph stages={stages} />
            <h3>Fat</h3>
            <PipelineGraph stages={stages} layout={layout} />
        </div>
    );
}

function renderListenersPipeline() {

    const stages = [
        makeNode('Build', [], validResultValues.success),
        makeNode('Test', [], validResultValues.success),
        makeNode('Browser Tests', [
            makeNode('Internet Explorer', [], validResultValues.queued),
            makeNode('Chrome', [], validResultValues.queued),
        ]),
        makeNode('Dev'),
        makeNode('Dev'), // Make sure it works with dupe names
        makeNode('Staging'),
        makeNode('Production'),
    ];

    function nodeClicked(...values) {
        console.log('Node clicked', values);
    }

    return <div><PipelineGraph stages={stages} onNodeClick={nodeClicked} /></div>;
}

function renderParallelPipeline() {

    const stages = [
        makeNode('Build'),
        makeNode('Test'),
        makeNode('Browser Tests', [
            makeNode('Internet Explorer'),
            makeNode('Chrome'),
        ]),
        makeNode('Dev but with long label'),
        makeNode('Staging'),
        makeNode('Production'),
    ];

    return (
        <div>
            <PipelineGraph stages={stages} />
        </div>
    );
}

function renderMultiStageParallel() {

    const stages = [
        makeNode('Alpha'),
        makeNode('Bravo', [
            makeNode('Single 1'),
            makeNode('Single 2'),
            makeNode('Single 3'),
            makeSequence(
                makeNode('Multi 1 of 3'),
                makeNode('Multi 2 of 3'),
                makeNode('Multi 3 of 3'),
            ),
            makeSequence(
                makeNode('Multi 1 of 2'),
                makeNode('Multi 2 of 2'),
            ),
            makeSequence(
                makeNode('Multi 1 of 4'),
                makeNode('Multi 2 of 4'),
                makeNode('Multi 3 of 4'),
                makeNode('Multi 4 of 4'),
            ),
            makeNode('Single 4'),
        ]),
        makeNode('Charlie'),
        makeNode('Delta'),
    ];

    return (
        <div>
            <PipelineGraph stages={stages} />
        </div>
    );
}

function renderMultiStageSpacing() {

    const stages = [
        makeNode('Alpha', [
            makeNode('Homer'),
            makeNode('Marge'),
        ]),
        makeNode('Blue'),
        makeNode('Bravo', [
            makeNode('Single 1'),
            makeSequence(
                makeNode('xxxxxxxxxxxxxxxxxxxxxxxxxx'),
                makeNode('xxxxxxxxxxxxxxxxxxxxxxxxxx'),
                makeNode('xxxxxxxxxxxxxxxxxxxxxxxxxx'),
            ),
            makeSequence(
                makeNode('Multi 1 of 4'),
                makeNode('Multi 2 of 4'),
                makeNode('Multi 3 of 4'),
                makeNode('Multi 4 of 4'),
            ),
        ]),
    ];

    return (
        <div style={{ padding: '2em' }}>
            <h3>120px (normal)</h3>
            <PipelineGraph stages={stages} layout={{ parallelSpacingH: 120 }} />
            <h3>100px</h3>
            <PipelineGraph stages={stages} layout={{ parallelSpacingH: 100 }} />
            <h3>95px</h3>
            <PipelineGraph stages={stages} layout={{ parallelSpacingH: 95 }} />
        </div>
    );
}

function renderEdgeCases1() {

    const stages1 = [
        makeNode('Alpha', [], validResultValues.skipped),
        makeNode('Bravo', [], validResultValues.success),
        makeNode('Charlie', [], validResultValues.skipped),
    ];

    const stages2 = [
        makeNode('Alpha', [
            makeNode('Delta', [], validResultValues.success),
            makeNode('Echo', [], validResultValues.success),
            makeNode('Foxtrot', [], validResultValues.success),
        ]),
        makeNode('Bravo', [], validResultValues.success),
        makeNode('Charlie', [
            makeNode('Golf', [], validResultValues.success),
            makeNode('Hotel', [], validResultValues.success),
            makeNode('Indigo', [], validResultValues.success),
        ]),
    ];

    const stages3 = [
        makeNode('Alpha', [], validResultValues.success),
        makeNode('Bravo', [], validResultValues.skipped),
        makeNode('Charlie', [], validResultValues.skipped),
    ];

    const stages4 = [
        makeNode('Alpha', [
            makeNode('Single 1'),
            makeSequence(
                makeNode('Multi 1 of 3'),
                makeNode('Multi 2 of 3'),
                makeNode('Multi 3 of 3'),
            ),
            makeSequence(
                makeNode('Multi 1 of 2'),
                makeNode('Multi 2 of 2'),
            ),
            makeNode('Single 2'),
        ]),
        makeNode('Bravo', [], validResultValues.skipped),
        makeNode('Charlie', [
            makeNode('Single 1'),
            makeSequence(
                makeNode('Multi 1 of 2'),
                makeNode('Multi 2 of 2'),
            ),
            makeNode('Single 2'),
        ]),
    ];

    const stages5 = [
        makeNode('Alpha', [
            makeNode('Single 1'),
            makeSequence(
                makeNode('Multi 1 of 3'),
                makeNode('Multi 2 of 3'),
                makeNode('Multi 3 of 3'),
            ),
            makeSequence(
                makeNode('Multi 1 of 2'),
                makeNode('Multi 2 of 2'),
            ),
            makeNode('Single 2'),
        ]),
        makeNode('Bravo'),
        makeNode('Charlie', [
            makeNode('Single 1'),
            makeSequence(
                makeNode('Multi 1 of 2'),
                makeNode('Multi 2 of 2'),
            ),
            makeNode('Single 2'),
        ]),
    ];

    return (
        <div>
            <PipelineGraph stages={stages1} selectedStage={stages1[1]} />
            <PipelineGraph stages={stages2} selectedStage={stages2[1]} />
            <PipelineGraph stages={stages3} selectedStage={stages3[0]} />
            <PipelineGraph stages={stages4} selectedStage={stages4[0].children[1].nextSibling.nextSibling} />
            <PipelineGraph stages={stages5} selectedStage={stages5[0].children[2]} />
        </div>
    );
}

function renderMultiParallelPipeline() {

    const stages = [
        makeNode('Build', [], validResultValues.success),
        makeNode('Test', [
            makeNode('JUnit', [], validResultValues.success),
            makeNode('DBUnit', [], validResultValues.success),
            makeNode('Jasmine', [], validResultValues.success),
        ]),
        makeNode('Browser Tests', [
            makeNode('Firefox', [], validResultValues.success),
            makeNode('Edge', [], validResultValues.failure),
            makeNode('Safari', [], validResultValues.running, 60),
            makeNode('Chrome', [], validResultValues.running, 120),
        ]),
        makeNode('Skizzled', [], validResultValues.skipped),
        makeNode('Foshizzle', [], validResultValues.skipped),
        makeNode('Dev', [
            makeNode('US-East', [], validResultValues.success),
            makeNode('US-West', [], validResultValues.success),
            makeNode('APAC', [], validResultValues.success),
        ], validResultValues.success),
        makeNode('Staging', [], validResultValues.skipped),
        makeNode('Production'),
    ];

    return <div><PipelineGraph stages={stages} selectedStage={stages[0]} /></div>;
}

function renderLongNames() {

    const stages = [
        makeNode('Build something with a long and descriptive name that takes up a shitload of space', [], validResultValues.success),
        makeNode('Test', [
            makeNode('JUnit', [], validResultValues.success),
            makeNode('DBUnit', [], validResultValues.success),
            makeNode('Jasmine', [], validResultValues.success),
        ]),
        makeNode('Browser Tests', [
            makeNode('Firefox', [], validResultValues.success),
            makeNode('Das komputermaschine ist nicht auf mittengraben unt die gerfingerpoken. Watchen das blinkenlights.', [], validResultValues.failure),
            makeNode('RubberbabybuggybumpersbetyoudidntknowIwasgoingtodothat', [], validResultValues.running, 60),
            makeNode('Chrome', [], validResultValues.running, 120),
        ]),
        makeNode('Dev'),
        makeNode('Staging'),
        makeNode('Production'),
    ];

    const stages2 = [
        makeNode('Alpha', [
            makeNode('Single 1'),
            makeSequence(
                makeNode('RubberbabybuggybumpersbetyoudidntknowIwasgoingtodothat'),
                makeNode('.............................................................................................'),
                makeNode('Das komputermaschine ist nicht auf mittengraben unt die gerfingerpoken. Watchen das blinkenlights.'),
            ),
            makeSequence(
                makeNode('Multi 1 of 2'),
                makeNode('Multi 2 of 2'),
            ),
            makeNode('Single 2'),
        ]),
        makeNode('Bravo'),
        makeNode('Charlie', [
            makeNode('Single 1'),
            makeSequence(
                makeNode('Multi 1 of 2'),
                makeNode('Multi 2 of 2'),
            ),
            makeNode('Single 2'),
        ]),
    ];

    return (
        <div>
            <PipelineGraph stages={stages} selectedStage={stages[0]} />
            <PipelineGraph stages={stages2} selectedStage={stages2[0]} />
        </div>
    );
}

function renderParallelPipelineDeep() {

    const stages = [
        makeNode('Build', [], validResultValues.success),
        makeNode('Test', [], validResultValues.success),
        makeNode('Browser Tests', [
            makeNode('Internet Explorer', [], validResultValues.success),
            makeNode('Firefox', [], validResultValues.running),
            makeNode('Edge', [], validResultValues.failure),
            makeNode('Safari', [], validResultValues.running),
            makeNode('LOLpera', [], validResultValues.queued),
            makeNode('Chrome', [], validResultValues.queued),
        ]),
        makeNode('Dev', [], validResultValues.not_built),
        makeNode('Staging', [], validResultValues.not_built),
        makeNode('Production', [], validResultValues.not_built),
    ];

    return <div><PipelineGraph stages={stages} /></div>;
}

let __id = 1;

/// Simple helper for data generation
function makeNode(name, children = [], state = validResultValues.not_built, completePercent) {
    completePercent = completePercent || ((state == validResultValues.running) ? Math.floor(Math.random() * 60 + 20) : 50);
    const id = __id++;
    return { name, children, state, completePercent, id };
}

function makeSequence(...stages) {
    for (let i = 0; i < stages.length - 1; i++) {
        stages[i].nextSibling = stages[i + 1];
    }

    return stages[0]; // The model only needs the first in a sequence
}

