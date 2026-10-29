/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// The default (8 tabs on this machine) ran free RAM down to ~0.5 GB and
// intermittently crashed the headless browser ("Page crashed!").
Config.setConcurrency(4);
