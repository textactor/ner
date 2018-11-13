#!/bin/bash

yarn unlink @textactor/domain
yarn unlink @textactor/actor-domain

yarn upgrade --latest

yarn add @textactor/domain
yarn add @textactor/actor-domain

yarn test
