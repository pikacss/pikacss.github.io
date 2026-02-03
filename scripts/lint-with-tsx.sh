#!/usr/bin/env bash
# Wrapper script for running ESLint with tsx support
NODE_OPTIONS='--import tsx' eslint --fix "$@"
