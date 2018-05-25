#!/bin/bash

yarn remove @textactor/domain
yarn remove @textactor/actor-domain

yarn link @textactor/domain
yarn link @textactor/actor-domain

yarn test
