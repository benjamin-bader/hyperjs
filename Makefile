OUTDIR=bin
LIB=$(OUTDIR)/hyper.js
CATTED=bin/catted.js
SPECS = $(shell find spec -type f -name *.js)

CLEVEL = SIMPLE_OPTIMIZATIONS
CFLAGS = --compilation-level=$(CLEVEL) --js_output_file=$(LIB)
COMPILE = closure-compiler $(CFLAGS)

SOURCES := $(shell cat BUILD_ORDER | tr '\n' ' ')

clean:
	@if [ -d $(OUTDIR) ]; then rm -rf $(OUTDIR); fi

all: test
	$(COMPILE) --js 

build: $(LIB)

$(LIB): $(addprefix --js ,$(SOURCES)) | $(OUTDIR)
	$(COMPILE) $<

test: $(CATTED) $(SPECS)
	for FILE in $(SPECS); do > test.js; cat $(CATTED) > test.js; cat $$FILE >> test.js; jasmine-headless-webkit test.js && rm test.js; done

$(CATTED): $(SOURCES) | $(OUTDIR)
	@> $@
	@for FILE in $(SOURCES); do cat $$FILE >> $@; done

$(OUTDIR):
	test -d $@ || mkdir $@

